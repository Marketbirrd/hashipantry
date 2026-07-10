import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Users, ChefHat, ArrowLeft, ShoppingBag } from "lucide-react";
import { readFile } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import IngredientItem from "@/components/IngredientItem";

type Ingredient = { name: string; amount: number; unit: string; original: string };
type Step = { step: number; instruction: string };
type ProductData = { id: string; name: string; description?: string; imageUrl: string; affiliateUrl: string; asin?: string; dietTags?: string[] };
type MatchedProduct = { id: string; name: string; description?: string; imageUrl: string; affiliateUrl: string; asin?: string | null; dietTags?: string[] };

// Module-level cache so Railway only reads the file once per cold start
let cachedProducts: ProductData[] | null = null;
async function getProducts(): Promise<ProductData[]> {
  if (cachedProducts) return cachedProducts;
  const filePath = path.join(process.cwd(), "public", "products.json");
  const raw = await readFile(filePath, "utf-8");
  cachedProducts = JSON.parse(raw);
  return cachedProducts!;
}

// Single-word generics that should never open a shop popup
const SKIP_SINGLE = new Set([
  "water", "salt", "pepper", "sugar", "butter", "oil", "flour", "milk",
  "egg", "eggs", "ice", "heat", "aside", "cool", "stir", "mix", "cook",
]);

// Words that are allowed to precede the ingredient phrase in a product name
// (organic coconut oil, pure avocado oil, 365 avocado oil, etc.)
const QUALIFIERS = new Set([
  "organic", "pure", "extra", "virgin", "cold", "pressed", "refined",
  "unrefined", "raw", "natural", "premium", "certified", "fresh", "dried",
  "unsalted", "salted", "roasted", "sprouted", "non", "gmo", "kosher",
  "vegan", "paleo", "keto", "gluten", "free", "range", "wild", "grass",
  "fed", "light", "dark", "smooth", "crunchy", "whole", "grain", "stone",
  "ground", "market", "foods", "brand",
]);

// Signal that the ingredient is a COMPONENT of the product, not the product itself
const SECONDARY_PATTERN = /\b(with|using|made|contains|featuring|from)\b/;

function cleanName(name: string): string {
  return name.toLowerCase().replace(/\s*\([^)]*\)/g, "").trim();
}

function isQualifierOnly(text: string): boolean {
  const trimmed = text.replace(/[,&]/g, " ").trim();
  if (!trimmed) return true;
  return trimmed.split(/\s+/).filter(Boolean).every(
    (w) => QUALIFIERS.has(w) || /^\d+(%|g|oz|ml|lb|ct|fl|pk)?$/.test(w)
  );
}

function findMatchingProducts(ingredientName: string, products: ProductData[]): MatchedProduct[] {
  const name = ingredientName.toLowerCase().trim();
  if (name.length < 4) return [];

  const isCompound = name.split(/\s+/).length >= 2;

  // Skip generic single-word ingredients
  if (!isCompound && SKIP_SINGLE.has(name)) return [];

  if (isCompound) {
    // Compound ingredients: require exact phrase AND check context around it
    return products
      .map((p) => {
        const pClean = cleanName(p.name);
        const idx = pClean.indexOf(name);
        if (idx === -1) return { product: p, score: 0 };

        const before = pClean.slice(0, idx);
        const after = pClean.slice(idx + name.length);

        // "Vodka Sauce With Avocado Oil" → ingredient is secondary, skip
        if (SECONDARY_PATTERN.test(before)) return { product: p, score: 0 };

        const beforeOk = isQualifierOnly(before);  // qualifiers/brand before → ok
        const afterOk = after.trim() === "" || isQualifierOnly(after); // nothing meaningful after

        let score = 0;
        if (beforeOk && afterOk) score = 10;    // "Pure Avocado Oil" — product IS the ingredient
        else if (!beforeOk && afterOk) score = 8; // "Primal Kitchen Avocado Oil" — brand + ingredient
        else score = 1;                           // "Avocado Oil Garlic Aioli" — ingredient is modifier

        return { product: p, score };
      })
      .filter((x) => x.score >= 5)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((x) => ({
        id: x.product.id,
        name: x.product.name,
        description: x.product.description,
        imageUrl: x.product.imageUrl,
        affiliateUrl: x.product.affiliateUrl,
        asin: x.product.asin ?? null,
        dietTags: x.product.dietTags,
      }));
  } else {
    // Single word: simple contains match (e.g. "walnuts", "cauliflower")
    return products
      .filter((p) => p.name.toLowerCase().includes(name))
      .slice(0, 3)
      .map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        imageUrl: p.imageUrl,
        affiliateUrl: p.affiliateUrl,
        asin: p.asin ?? null,
        dietTags: p.dietTags,
      }));
  }
}

function formatAmount(amount: number, unit: string): string {
  if (!amount && !unit) return "";
  const amtStr = amount ? (Number.isInteger(amount) ? String(amount) : amount.toFixed(2).replace(/\.?0+$/, "")) : "";
  return [amtStr, unit].filter(Boolean).join(" ");
}

// Upgrade Spoonacular thumbnail URLs to the largest available size
function heroImageUrl(url: string): string {
  return url.replace(/-\d+x\d+(\.\w+)$/, "-636x393$1");
}

const TAG_COLORS: Record<string, string> = {
  "AIP": "bg-emerald-100 text-emerald-800",
  "Gluten Free": "bg-amber-100 text-amber-800",
  "Dairy Free": "bg-blue-100 text-blue-800",
  "Grain Free": "bg-purple-100 text-purple-800",
  "Vegan": "bg-green-100 text-green-800",
  "Paleo": "bg-orange-100 text-orange-800",
  "Anti-Inflammatory": "bg-red-100 text-red-800",
  "Vegetarian": "bg-teal-100 text-teal-800",
};

export default async function RecipePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const [recipe, products] = await Promise.all([
    prisma.recipe.findUnique({ where: { slug } }),
    getProducts(),
  ]);

  if (!recipe) notFound();

  const ingredients = (recipe.ingredients as unknown as Ingredient[]) ?? [];
  const steps = (recipe.steps as unknown as Step[]) ?? [];
  const heroImg = recipe.imageUrl ? heroImageUrl(recipe.imageUrl) : "";

  // Match each ingredient to shop products server-side
  const ingredientMatches = ingredients.map((ing) => findMatchingProducts(ing.name, products));
  const matchCount = ingredientMatches.filter((m) => m.length > 0).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back link */}
      <Link href="/recipes" className="inline-flex items-center gap-1.5 text-sm text-forest/60 hover:text-forest mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Recipes
      </Link>

      {/* Hero image */}
      <div className="w-full rounded-3xl aspect-[2/1] overflow-hidden mb-8 bg-sage-pale relative">
        {heroImg ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={heroImg} alt={recipe.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ChefHat className="w-16 h-16 text-forest/20" />
          </div>
        )}
        <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-forest/70 text-xs font-semibold px-3 py-1 rounded-full">
          {recipe.category}
        </span>
      </div>

      {/* Title + meta */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {recipe.dietTags.map((tag) => (
            <span key={tag} className={`text-xs font-semibold px-2.5 py-1 rounded-full ${TAG_COLORS[tag] ?? "bg-sage-pale text-forest/70"}`}>
              {tag}
            </span>
          ))}
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest mb-3">{recipe.title}</h1>
        <p className="text-forest/60 text-base leading-relaxed mb-5">{recipe.excerpt}</p>

        {/* Stats bar */}
        <div className="flex flex-wrap gap-6 py-5 border-y border-sage-pale">
          <div className="text-center">
            <p className="text-xs text-forest/40 uppercase tracking-wide font-medium mb-0.5">Time</p>
            <p className="text-lg font-bold text-forest flex items-center gap-1"><Clock className="w-4 h-4" />{recipe.prepTime}m</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-forest/40 uppercase tracking-wide font-medium mb-0.5">Servings</p>
            <p className="text-lg font-bold text-forest flex items-center gap-1"><Users className="w-4 h-4" />{recipe.servings}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-forest/40 uppercase tracking-wide font-medium mb-0.5">Difficulty</p>
            <p className="text-lg font-bold text-forest">{recipe.difficulty}</p>
          </div>
          {matchCount > 0 && (
            <div className="text-center">
              <p className="text-xs text-forest/40 uppercase tracking-wide font-medium mb-0.5">Shop Links</p>
              <p className="text-lg font-bold text-green flex items-center gap-1"><ShoppingBag className="w-4 h-4" />{matchCount} ingredients</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-[300px_1fr] gap-10">
        {/* Ingredients */}
        <aside>
          <h2 className="font-serif text-xl font-bold text-forest mb-4">Ingredients</h2>
          <ul className="space-y-3">
            {ingredients.map((ing, i) => (
              <IngredientItem
                key={i}
                amount={formatAmount(ing.amount, ing.unit)}
                name={ing.name}
                original={ing.original}
                matches={ingredientMatches[i]}
              />
            ))}
          </ul>

          {matchCount > 0 && (
            <div className="mt-6 p-4 bg-sage-pale rounded-xl">
              <p className="text-xs text-forest/60 leading-relaxed">
                <ShoppingBag className="w-3.5 h-3.5 inline mr-1 text-green" />
                Tap any <span className="text-green font-medium">green ingredient</span> to find it in the HashiPantry shop and add it to your cart.
              </p>
            </div>
          )}
        </aside>

        {/* Instructions */}
        <div>
          <h2 className="font-serif text-xl font-bold text-forest mb-4">Instructions</h2>
          <ol className="space-y-5">
            {steps.map((s, i) => (
              <li key={i} className="flex gap-4">
                <span className="shrink-0 w-7 h-7 rounded-full bg-forest text-white text-xs font-bold flex items-center justify-center mt-0.5">
                  {s.step ?? i + 1}
                </span>
                <p className="text-sm text-forest/80 leading-relaxed pt-1">{s.instruction}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-14 pt-8 border-t border-sage-pale text-center">
        <p className="text-forest/50 text-sm mb-3">Looking for more Hashimoto&apos;s-friendly recipes?</p>
        <Link
          href="/recipes"
          className="inline-flex items-center gap-2 bg-forest text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-forest-light transition-colors"
        >
          Browse All Recipes
        </Link>
      </div>
    </div>
  );
}
