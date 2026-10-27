import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const API_KEY = process.env.SPOONACULAR_API_KEY!;
const BASE = "https://api.spoonacular.com";

const SEARCHES = [
  // Existing searches
  { query: "hashimotos thyroid gluten free", tags: ["Gluten Free"] },
  { query: "AIP autoimmune paleo", tags: ["AIP", "Gluten Free", "Dairy Free"] },
  { query: "paleo breakfast", tags: ["Paleo", "Gluten Free", "Dairy Free"] },
  { query: "anti inflammatory soup", tags: ["Gluten Free", "Dairy Free"] },
  { query: "grain free snack", tags: ["Grain Free", "Gluten Free"] },
  { query: "dairy free smoothie thyroid", tags: ["Dairy Free", "Gluten Free"] },
  // Dinner-specific: protein + cooking method to avoid soup/salad/breakfast matching
  { query: "gluten free chicken thighs baked", tags: ["Gluten Free", "Dairy Free"] },
  { query: "paleo salmon fillet dinner", tags: ["Paleo", "Gluten Free", "Dairy Free"] },
  { query: "AIP ground beef bowl", tags: ["AIP", "Gluten Free", "Dairy Free"] },
  { query: "gluten free turkey meatballs", tags: ["Gluten Free", "Dairy Free"] },
  { query: "paleo pork chops roasted", tags: ["Paleo", "Gluten Free", "Dairy Free"] },
  { query: "grain free shrimp stir fry", tags: ["Grain Free", "Gluten Free", "Dairy Free"] },
  { query: "AIP chicken casserole", tags: ["AIP", "Gluten Free", "Dairy Free"] },
  { query: "gluten free beef roast", tags: ["Gluten Free", "Dairy Free"] },
  { query: "vegan gluten free lentil dinner", tags: ["Vegan", "Gluten Free", "Dairy Free"] },
  { query: "paleo lamb chops", tags: ["Paleo", "Gluten Free", "Dairy Free"] },
];

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const DINNER_NOUNS = [
  "chicken", "beef", "pork", "salmon", "shrimp", "fish", "steak", "lamb",
  "turkey", "tuna", "cod", "tilapia", "halibut", "duck", "bison", "venison",
  "noodles", "pasta", "spaghetti", "linguine", "fettuccine", "zoodles",
  "bowl", "stir fry", "stir-fry", "casserole", "roast", "bake", "baked",
  "grilled", "curry", "stuffed", "meatball", "meatloaf", "burger",
  "skillet", "sheet pan", "one pot",
];

function getCategory(title: string, _dishTypes: string[]): string {
  const t = title.toLowerCase();
  if (["breakfast", "pancake", "waffle", "oatmeal", "granola", "french toast"].some(k => t.includes(k))) return "Breakfast";
  if (["smoothie", "shake", "juice", "latte", "elixir"].some(k => t.includes(k))) return "Smoothies & Drinks";
  if (["soup", "stew", "broth", "chili", "chowder", "bisque", "ramen", "pho"].some(k => t.includes(k))) return "Soups & Stews";
  if (DINNER_NOUNS.some(k => t.includes(k))) return "Dinner";
  if (["sauce", "dressing", "dip", "aioli", "marinade", "gravy", "salsa", "pesto", "hummus"].some(k => t.includes(k))) return "Sauces & Condiments";
  if (["snack", "cookie", "bar ", "energy bite", "muffin", "cracker", "chip "].some(k => t.includes(k))) return "Snacks";
  if (["salad", "sandwich", "wrap", "hoagie"].some(k => t.includes(k))) return "Lunch";
  return "Dinner";
}

async function fetchRecipes(query: string, extraTags: string[]) {
  const params = new URLSearchParams({
    apiKey: API_KEY,
    query,
    diet: "gluten free",
    intolerances: "gluten,dairy",
    number: "20",
    addRecipeInformation: "true",
    fillIngredients: "true",
    instructionsRequired: "true",
  });

  const res = await fetch(`${BASE}/recipes/complexSearch?${params}`);
  if (!res.ok) throw new Error(`Spoonacular error: ${res.status}`);
  const data = await res.json();
  return { results: data.results ?? [], extraTags };
}

async function main() {
  console.log("Seeding recipes from Spoonacular...\n");
  let added = 0;
  let skipped = 0;
  const seenSlugs = new Set<string>();

  for (const { query, tags } of SEARCHES) {
    console.log(`Fetching: "${query}"...`);
    try {
      const { results, extraTags } = await fetchRecipes(query, tags);
      console.log(`  Got ${results.length} results`);

      for (const r of results) {
        const slug = slugify(r.title);
        if (seenSlugs.has(slug)) { skipped++; continue; }

        const existing = await prisma.recipe.findUnique({ where: { slug } });
        if (existing) { seenSlugs.add(slug); skipped++; continue; }

        // Build diet tags from Spoonacular flags + our extra tags
        const dietTags: string[] = [...extraTags];
        if (r.glutenFree) dietTags.push("Gluten Free");
        if (r.dairyFree) dietTags.push("Dairy Free");
        if (r.vegan) dietTags.push("Vegan");
        if (r.vegetarian && !r.vegan) dietTags.push("Vegetarian");
        if (r.veryHealthy) dietTags.push("Anti-Inflammatory");
        const uniqueTags = [...new Set(dietTags)];

        const ingredients = (r.extendedIngredients ?? []).map((i: { original: string; name: string; amount: number; unit: string }) => ({
          name: i.name,
          amount: i.amount,
          unit: i.unit,
          original: i.original,
        }));

        const steps = (r.analyzedInstructions?.[0]?.steps ?? []).map((s: { number: number; step: string }) => ({
          step: s.number,
          instruction: s.step,
        }));

        if (steps.length === 0) { skipped++; continue; }

        const category = getCategory(r.title, r.dishTypes ?? []);

        await prisma.recipe.create({
          data: {
            title: r.title,
            slug,
            imageUrl: r.image ?? "",
            prepTime: r.readyInMinutes ?? 30,
            servings: r.servings ?? 2,
            difficulty: r.readyInMinutes <= 20 ? "Easy" : r.readyInMinutes <= 45 ? "Medium" : "Hard",
            excerpt: r.summary
              ? r.summary.replace(/<[^>]*>/g, "").slice(0, 200) + "…"
              : `A delicious ${category.toLowerCase()} recipe that's Hashimoto's-friendly.`,
            ingredients,
            steps,
            category,
            dietTags: uniqueTags,
          },
        });

        seenSlugs.add(slug);
        added++;
        process.stdout.write(`  ✓ ${r.title}\n`);
      }

      // Small delay to respect rate limits
      await new Promise((r) => setTimeout(r, 500));
    } catch (e) {
      console.error(`  Error: ${e}`);
    }
  }

  console.log(`\nDone! Added: ${added} | Skipped: ${skipped}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
