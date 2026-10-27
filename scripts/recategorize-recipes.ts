/**
 * One-time script: re-runs improved category logic on all existing recipes.
 * Run: npm run recategorize
 *
 * Root cause: Spoonacular includes "lunch" in dishTypes for almost every
 * main course, so the old check `t.includes("lunch")` was routing dinner
 * mains into the Lunch category.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// If any of these appear in the title it's a main dish — checked BEFORE sauce/condiment
const DINNER_NOUNS = [
  "chicken", "beef", "pork", "salmon", "shrimp", "fish", "steak", "lamb",
  "turkey", "tuna", "cod", "tilapia", "halibut", "duck", "bison", "venison",
  "noodles", "pasta", "spaghetti", "linguine", "fettuccine", "zoodles",
  "bowl", "stir fry", "stir-fry", "casserole", "roast", "bake", "baked",
  "grilled", "curry", "stuffed", "meatball", "meatloaf", "burger",
  "skillet", "sheet pan", "one pot", "frittata",
];

function getCategory(title: string, _dishTypes: string[]): string {
  const t = title.toLowerCase();

  // Breakfast
  if (["breakfast", "pancake", "waffle", "oatmeal", "granola", "french toast"].some(k => t.includes(k))) return "Breakfast";

  // Drinks
  if (["smoothie", "shake", "juice", "latte", "elixir"].some(k => t.includes(k))) return "Smoothies & Drinks";

  // Soups (before dinner check so "chicken soup" → Soups & Stews, not Dinner)
  if (["soup", "stew", "broth", "chili", "chowder", "bisque", "ramen", "pho"].some(k => t.includes(k))) return "Soups & Stews";

  // Main dish proteins/formats → Dinner, before sauce check catches "noodles with sauce"
  if (DINNER_NOUNS.some(k => t.includes(k))) return "Dinner";

  // Sauces & condiments — only if no main dish noun was found above
  if (["sauce", "dressing", "dip", "aioli", "marinade", "gravy", "salsa", "pesto", "hummus"].some(k => t.includes(k))) return "Sauces & Condiments";

  // Snacks
  if (["snack", "cookie", "bar ", "energy bite", "muffin", "cracker", "chip "].some(k => t.includes(k))) return "Snacks";

  // Genuinely lunch-specific (not just "lunch" from dishTypes)
  if (["salad", "sandwich", "wrap", "hoagie"].some(k => t.includes(k))) return "Lunch";

  // Default — covers veggie mains, grain dishes, etc.
  return "Dinner";
}

async function main() {
  const recipes = await prisma.recipe.findMany({ select: { id: true, title: true, category: true } });
  console.log(`Found ${recipes.length} recipes. Recategorizing...`);

  const counts: Record<string, number> = {};
  let updated = 0;

  for (const recipe of recipes) {
    // dishTypes not stored — re-derive from title only (good enough)
    const newCat = getCategory(recipe.title, []);
    counts[newCat] = (counts[newCat] ?? 0) + 1;

    if (newCat !== recipe.category) {
      await prisma.recipe.update({ where: { id: recipe.id }, data: { category: newCat } });
      console.log(`  ${recipe.title}: ${recipe.category} → ${newCat}`);
      updated++;
    }
  }

  console.log(`\nDone! Updated ${updated} recipes.`);
  console.log("New distribution:", counts);
}

main().catch(console.error).finally(() => prisma.$disconnect());
