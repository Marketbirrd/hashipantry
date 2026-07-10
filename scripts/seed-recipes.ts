import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const API_KEY = process.env.SPOONACULAR_API_KEY!;
const BASE = "https://api.spoonacular.com";

const SEARCHES = [
  { query: "hashimotos thyroid gluten free", tags: ["Gluten Free"] },
  { query: "AIP autoimmune paleo", tags: ["AIP", "Gluten Free", "Dairy Free"] },
  { query: "gluten free dairy free dinner", tags: ["Gluten Free", "Dairy Free"] },
  { query: "paleo breakfast", tags: ["Paleo", "Gluten Free", "Dairy Free"] },
  { query: "anti inflammatory soup", tags: ["Gluten Free", "Dairy Free"] },
  { query: "grain free snack", tags: ["Grain Free", "Gluten Free"] },
  { query: "dairy free smoothie thyroid", tags: ["Dairy Free", "Gluten Free"] },
  { query: "vegan gluten free dinner", tags: ["Vegan", "Gluten Free", "Dairy Free"] },
];

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function getCategory(title: string, dishTypes: string[]): string {
  const t = (title + " " + dishTypes.join(" ")).toLowerCase();
  if (t.includes("breakfast") || t.includes("pancake") || t.includes("waffle") || t.includes("egg")) return "Breakfast";
  if (t.includes("smoothie") || t.includes("drink") || t.includes("juice") || t.includes("shake")) return "Smoothies & Drinks";
  if (t.includes("soup") || t.includes("stew") || t.includes("broth") || t.includes("chili")) return "Soups & Stews";
  if (t.includes("salad") || t.includes("lunch") || t.includes("wrap") || t.includes("sandwich")) return "Lunch";
  if (t.includes("sauce") || t.includes("dressing") || t.includes("dip") || t.includes("condiment")) return "Sauces & Condiments";
  if (t.includes("snack") || t.includes("cookie") || t.includes("bar") || t.includes("bite") || t.includes("muffin")) return "Snacks";
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
