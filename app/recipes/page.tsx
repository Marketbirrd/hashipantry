"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Clock, Users, ChefHat } from "lucide-react";
import { RECIPES, RECIPE_CATEGORIES } from "@/lib/recipes-data";

const CATEGORY_COLORS: Record<string, string> = {
  Breakfast: "from-amber-100 to-orange-100",
  Lunch: "from-green-100 to-emerald-100",
  Dinner: "from-blue-100 to-indigo-100",
  Snacks: "from-yellow-100 to-amber-100",
  "Soups & Stews": "from-red-100 to-orange-100",
  "Smoothies & Drinks": "from-teal-100 to-cyan-100",
  "Sauces & Condiments": "from-lime-100 to-green-100",
};

const TAG_COLORS: Record<string, string> = {
  "AIP": "bg-emerald-100 text-emerald-800",
  "Gluten Free": "bg-amber-100 text-amber-800",
  "Dairy Free": "bg-blue-100 text-blue-700",
  "Vegan": "bg-green-100 text-green-800",
  "Paleo": "bg-orange-100 text-orange-800",
};

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  Breakfast: "Start your day with nourishing, thyroid-friendly meals that energize without inflammation.",
  Lunch: "Satisfying midday meals packed with anti-inflammatory ingredients to keep you going.",
  Dinner: "Wholesome evening meals the whole family can enjoy — healing, delicious, and simple.",
  Snacks: "Quick, nutrient-dense snacks that won't spike blood sugar or trigger inflammation.",
  "Soups & Stews": "Gut-healing, warming soups perfect for batch cooking and meal prep.",
  "Smoothies & Drinks": "Nourishing sips to support your thyroid and immune system.",
  "Sauces & Condiments": "Flavor-packed, AIP-friendly sauces you can keep in your fridge all week.",
};

export default function RecipesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Recipes");

  const filtered = RECIPES.filter((r) => {
    const matchesSearch =
      !search ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      r.dietTags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = category === "All Recipes" || r.category === category;
    return matchesSearch && matchesCategory;
  });

  const groups: Record<string, typeof RECIPES> = {};
  if (category === "All Recipes") {
    for (const r of filtered) {
      if (!groups[r.category]) groups[r.category] = [];
      groups[r.category].push(r);
    }
  } else {
    groups[category] = filtered;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold text-forest mb-2">Recipes</h1>
        <p className="text-forest/60 text-sm">
          Every recipe is Hashimoto&apos;s-friendly, gluten-free, and uses ingredients linked directly to the shop.
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-xl mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-forest/40" />
        <input
          type="text"
          placeholder="Search recipes, ingredients, or diet type…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-sage-pale rounded-xl text-forest placeholder-forest/40 text-sm focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
        />
      </div>

      {/* Category tabs */}
      <div className="flex gap-1 overflow-x-auto pb-2 mb-8 scrollbar-hide">
        {RECIPE_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`shrink-0 text-sm px-4 py-2 rounded-lg font-medium transition-colors ${
              category === cat ? "bg-forest text-white" : "text-forest/60 hover:bg-sage-pale"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-forest/40 text-lg">No recipes match your search.</p>
          <button onClick={() => { setSearch(""); setCategory("All Recipes"); }} className="mt-3 text-green text-sm hover:underline">
            Clear search
          </button>
        </div>
      ) : (
        Object.entries(groups).map(([cat, recipes]) =>
          recipes.length === 0 ? null : (
            <section key={cat} className="mb-14">
              <h2 className="font-serif text-2xl font-bold text-forest mb-1">{cat}</h2>
              {CATEGORY_DESCRIPTIONS[cat] && (
                <p className="text-sm text-forest/50 mb-5">{CATEGORY_DESCRIPTIONS[cat]}</p>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {recipes.map((recipe) => {
                  const totalTime = recipe.prepTime + recipe.cookTime;
                  const bg = CATEGORY_COLORS[recipe.category] ?? "from-sage-pale to-cream";
                  return (
                    <div
                      key={recipe.slug}
                      className="bg-white rounded-2xl overflow-hidden border border-sage-pale hover:shadow-lg transition-shadow group flex flex-col"
                    >
                      {/* Image placeholder */}
                      <div className={`aspect-[4/3] bg-gradient-to-br ${bg} flex items-center justify-center`}>
                        <ChefHat className="w-10 h-10 text-forest/20" />
                      </div>

                      <div className="p-3 flex flex-col flex-1">
                        {/* Diet tags */}
                        <div className="flex flex-wrap gap-1 mb-2">
                          {recipe.dietTags.slice(0, 2).map((tag) => (
                            <span key={tag} className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${TAG_COLORS[tag] ?? "bg-sage-pale text-forest/70"}`}>
                              {tag}
                            </span>
                          ))}
                        </div>

                        <h3 className="font-semibold text-forest text-sm leading-snug mb-1 line-clamp-2">
                          {recipe.title}
                        </h3>
                        <p className="text-xs text-forest/50 line-clamp-2 flex-1 mb-3">
                          {recipe.excerpt}
                        </p>

                        <div className="flex items-center gap-3 text-xs text-forest/40 mb-3">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {totalTime >= 60 ? `${Math.floor(totalTime / 60)}h ${totalTime % 60 > 0 ? `${totalTime % 60}m` : ""}`.trim() : `${totalTime}m`}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" /> {recipe.servings}
                          </span>
                        </div>

                        <Link
                          href={`/recipes/${recipe.slug}`}
                          className="block w-full text-center bg-forest text-white text-xs font-semibold py-2.5 rounded-lg hover:bg-forest-light transition-colors"
                        >
                          View Recipe
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )
        )
      )}
    </div>
  );
}
