import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Users, ChefHat, ArrowLeft, ShoppingBag } from "lucide-react";
import { RECIPES } from "@/lib/recipes-data";

export function generateStaticParams() {
  return RECIPES.map((r) => ({ slug: r.slug }));
}

const TAG_COLORS: Record<string, string> = {
  "AIP": "bg-emerald-100 text-emerald-800",
  "Gluten Free": "bg-amber-100 text-amber-800",
  "Dairy Free": "bg-blue-100 text-blue-800",
  "Grain Free": "bg-purple-100 text-purple-800",
  "Vegan": "bg-green-100 text-green-800",
  "Paleo": "bg-orange-100 text-orange-800",
};

const CATEGORY_COLORS: Record<string, string> = {
  Breakfast: "from-amber-100 to-orange-100",
  Lunch: "from-green-100 to-emerald-100",
  Dinner: "from-blue-100 to-indigo-100",
  Snacks: "from-yellow-100 to-amber-100",
  "Soups & Stews": "from-red-100 to-orange-100",
  "Smoothies & Drinks": "from-teal-100 to-cyan-100",
  "Sauces & Condiments": "from-lime-100 to-green-100",
};

export default async function RecipePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const recipe = RECIPES.find((r) => r.slug === slug);
  if (!recipe) notFound();

  const totalTime = recipe.prepTime + recipe.cookTime;
  const bgGradient = CATEGORY_COLORS[recipe.category] ?? "from-sage-pale to-cream";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back link */}
      <Link href="/recipes" className="inline-flex items-center gap-1.5 text-sm text-forest/60 hover:text-forest mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Recipes
      </Link>

      {/* Hero image area */}
      <div className={`w-full rounded-3xl bg-gradient-to-br ${bgGradient} aspect-[2/1] flex items-center justify-center mb-8 overflow-hidden`}>
        <div className="text-center p-8">
          <ChefHat className="w-16 h-16 text-forest/20 mx-auto mb-3" />
          <p className="text-forest/40 text-sm font-medium">{recipe.category}</p>
        </div>
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

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest mb-3">
          {recipe.title}
        </h1>
        <p className="text-forest/60 text-base leading-relaxed mb-5">{recipe.excerpt}</p>

        {/* Stats bar */}
        <div className="flex flex-wrap gap-6 py-5 border-y border-sage-pale">
          <div className="text-center">
            <p className="text-xs text-forest/40 uppercase tracking-wide font-medium mb-0.5">Prep</p>
            <p className="text-lg font-bold text-forest">{recipe.prepTime}m</p>
          </div>
          {recipe.cookTime > 0 && (
            <div className="text-center">
              <p className="text-xs text-forest/40 uppercase tracking-wide font-medium mb-0.5">Cook</p>
              <p className="text-lg font-bold text-forest">{recipe.cookTime >= 60 ? `${Math.floor(recipe.cookTime / 60)}h ${recipe.cookTime % 60 > 0 ? `${recipe.cookTime % 60}m` : ""}`.trim() : `${recipe.cookTime}m`}</p>
            </div>
          )}
          <div className="text-center">
            <p className="text-xs text-forest/40 uppercase tracking-wide font-medium mb-0.5">Total</p>
            <p className="text-lg font-bold text-forest">{totalTime >= 60 ? `${Math.floor(totalTime / 60)}h ${totalTime % 60 > 0 ? `${totalTime % 60}m` : ""}`.trim() : `${totalTime}m`}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-forest/40 uppercase tracking-wide font-medium mb-0.5">Servings</p>
            <p className="text-lg font-bold text-forest">{recipe.servings}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-forest/40 uppercase tracking-wide font-medium mb-0.5">Difficulty</p>
            <p className="text-lg font-bold text-forest">{recipe.difficulty}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-10">
        {/* Ingredients */}
        <aside>
          <h2 className="font-serif text-xl font-bold text-forest mb-4">Ingredients</h2>
          <ul className="space-y-3">
            {recipe.ingredients.map((ing, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-green mt-2" />
                <span>
                  <span className="font-medium text-forest">{ing.amount}</span>
                  {" "}
                  {ing.productSearch ? (
                    <Link
                      href={`/shop?search=${encodeURIComponent(ing.productSearch)}`}
                      className="text-green hover:underline inline-flex items-center gap-0.5 font-medium"
                    >
                      {ing.name}
                      <ShoppingBag className="w-3 h-3 ml-0.5 opacity-60" />
                    </Link>
                  ) : (
                    <span className="text-forest/70">{ing.name}</span>
                  )}
                </span>
              </li>
            ))}
          </ul>

          {/* Shop prompt */}
          <div className="mt-6 p-4 bg-sage-pale rounded-xl">
            <p className="text-xs text-forest/60 leading-relaxed">
              <ShoppingBag className="w-3.5 h-3.5 inline mr-1 text-green" />
              Tap any <span className="text-green font-medium">green ingredient</span> to find it in the shop and add it to your cart.
            </p>
          </div>
        </aside>

        {/* Instructions */}
        <div>
          <h2 className="font-serif text-xl font-bold text-forest mb-4">Instructions</h2>
          <ol className="space-y-5">
            {recipe.steps.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="shrink-0 w-7 h-7 rounded-full bg-forest text-white text-xs font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <p className="text-sm text-forest/80 leading-relaxed pt-1">{step}</p>
              </li>
            ))}
          </ol>

          {recipe.notes && (
            <div className="mt-8 p-5 bg-amber-50 border border-amber-200 rounded-2xl">
              <p className="text-xs font-bold text-amber-800 uppercase tracking-wide mb-1">Chef&apos;s Note</p>
              <p className="text-sm text-amber-900 leading-relaxed">{recipe.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* More recipes CTA */}
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
