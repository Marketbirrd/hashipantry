/**
 * Run once with the Railway DATABASE_URL:
 *   DATABASE_URL="postgresql://..." node scripts/fix-recipes.mjs
 *
 * What this does:
 *  1. Reports all recipes so you can review them
 *  2. Clears auto-generated filler excerpts
 *  3. Fixes obvious wrong cook times (taco bowls, lentil soup)
 *  4. Fixes the black-eyed pea curry category (Breakfast → Dinner)
 *  5. Flags recipes named after other sources
 */

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// --- 1. Report all recipes ---
const all = await prisma.recipe.findMany({
  select: { id: true, slug: true, title: true, category: true, prepTime: true, excerpt: true },
  orderBy: { title: "asc" },
});
console.log(`\nTotal recipes: ${all.length}`);

const cats = {};
for (const r of all) { cats[r.category] = (cats[r.category] || 0) + 1; }
console.log("Categories:", JSON.stringify(cats));

console.log("\n--- All recipes ---");
for (const r of all) {
  console.log(`[${r.id}] ${r.title} | ${r.category} | ${r.prepTime}m`);
  if (r.excerpt) console.log(`    ${r.excerpt.substring(0, 100)}`);
}

// --- 2. Clear filler excerpts ---
const fillerPatterns = [
  /expand your recipe box/i,
  /costs \$\d/i,
  /\$\d+\.\d+ per serving/i,
  /[^.!?]\s\S{1,3}[…\.]*$/,  // cut off mid-word (e.g. "paleolithic, and pr…")
];

let clearedCount = 0;
for (const r of all) {
  if (!r.excerpt) continue;
  const isFiller = fillerPatterns.some(p => p.test(r.excerpt));
  if (isFiller) {
    await prisma.recipe.update({ where: { id: r.id }, data: { excerpt: "" } });
    console.log(`Cleared excerpt: ${r.title}`);
    clearedCount++;
  }
}
console.log(`\nCleared ${clearedCount} filler excerpts`);

// --- 3. Fix known bad cook times ---
// Taco bowls should be ~30-45min, not 180
// Lentil soup should be ~60min, not 240
const timeFixes = [
  { pattern: /taco bowl/i, prepTime: 35 },
  { pattern: /lentil soup/i, prepTime: 60 },
  { pattern: /lentil/i, prepTime: 60 },
];
for (const r of all) {
  for (const fix of timeFixes) {
    if (fix.pattern.test(r.title) && r.prepTime > 100) {
      await prisma.recipe.update({ where: { id: r.id }, data: { prepTime: fix.prepTime } });
      console.log(`Fixed time: ${r.title} ${r.prepTime}m → ${fix.prepTime}m`);
    }
  }
}

// --- 4. Fix category mismatches ---
// Black-eyed pea curry should not be Breakfast
for (const r of all) {
  if (/black.eyed pea/i.test(r.title) && r.category === "Breakfast") {
    await prisma.recipe.update({ where: { id: r.id }, data: { category: "Dinner" } });
    console.log(`Fixed category: ${r.title} Breakfast → Dinner`);
  }
}

// --- 5. Flag attribution issues ---
const attributionFlags = ["moosewood", "herbivoracious", "ottolenghi", "smitten kitchen", "bon appétit", "food52"];
console.log("\n--- Attribution flags (review and decide: credit or delete) ---");
for (const r of all) {
  const titleLower = r.title.toLowerCase();
  for (const flag of attributionFlags) {
    if (titleLower.includes(flag)) {
      console.log(`  ATTRIBUTED: [${r.id}] ${r.title} → consider adding credit or removing`);
    }
  }
}

await prisma.$disconnect();
console.log("\nDone.");
