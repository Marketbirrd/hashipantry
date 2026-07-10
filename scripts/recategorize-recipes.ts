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

// Title-only keywords → these override dishTypes
const TITLE_RULES: [string[], string][] = [
  [["breakfast", "pancake", "waffle", "oatmeal", "granola", "french toast", "frittata"], "Breakfast"],
  [["smoothie", "shake", "juice", "latte", "coffee", "tea drink", "elixir"], "Smoothies & Drinks"],
  [["soup", "stew", "broth", "chili", "chowder", "bisque", "ramen", "pho"], "Soups & Stews"],
  [["sauce", "dressing", "dip", "aioli", "marinade", "condiment", "gravy", "salsa"], "Sauces & Condiments"],
  [["snack", "cookie", "bar ", "energy bite", "muffin", "cracker", "chip ", "granola bar"], "Snacks"],
  // Salad/sandwich/wrap are genuinely lunch
  [["salad", "sandwich", "wrap", "sub ", "hoagie"], "Lunch"],
];

function getCategory(title: string, dishTypes: string[]): string {
  const t = title.toLowerCase();

  for (const [keywords, cat] of TITLE_RULES) {
    if (keywords.some(k => t.includes(k))) return cat;
  }

  // If Spoonacular explicitly calls it a side dish or appetizer, keep as Snacks
  const dLower = dishTypes.map(d => d.toLowerCase());
  if (dLower.some(d => ["side dish", "appetizer", "antipasti", "starter", "fingerfood"].includes(d))) return "Snacks";
  if (dLower.some(d => ["breakfast", "morning meal", "brunch"].includes(d))) return "Breakfast";
  if (dLower.some(d => ["soup"].includes(d))) return "Soups & Stews";

  // Everything else is Dinner (main course, dinner, lunch-labeled mains, etc.)
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
