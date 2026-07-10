"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search, Clock, Users, ChefHat, Filter } from "lucide-react";

type Recipe = {
  id: string;
  title: string;
  slug: string;
  imageUrl: string;
  prepTime: number;
  servings: number;
  difficulty: string;
  excerpt: string;
  category: string;
  dietTags: string[];
};

const CATEGORIES = ["All", "Breakfast", "Lunch", "Dinner", "Snacks", "Soups & Stews", "Smoothies & Drinks", "Sauces & Condiments"];
const DIET_TAGS = ["Gluten Free", "Dairy Free", "AIP", "Paleo", "Vegan", "Grain Free", "Anti-Inflammatory"];

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [activeDiet, setActiveDiet] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category !== "All") params.set("category", category);
    activeDiet.forEach((d) => params.append("diet", d));
    params.set("page", String(page));

    const res = await fetch(`/api/recipes?${params}`);
    const data = await res.json();
    setRecipes(data.recipes ?? []);
    setTotal(data.total ?? 0);
    setPages(data.pages ?? 1);
    setLoading(false);
  }, [search, category, activeDiet, page]);

  useEffect(() => {
    setPage(1);
  }, [search, category, activeDiet]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const toggleDiet = (tag: string) => {
    setActiveDiet((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold text-forest mb-2">Recipes</h1>
        <p className="text-forest/60 text-sm">
          Every recipe is Hashimoto&apos;s-friendly with ingredients linked directly to the shop.
        </p>
      </div>

      {/* Search + Filter toggle */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-forest/40" />
          <input
            type="text"
            placeholder="Search recipes…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-sage-pale rounded-xl text-forest placeholder-forest/40 text-sm focus:outline-none focus:ring-2 focus:ring-green/30"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${showFilters || activeDiet.length > 0 ? "bg-forest text-white border-forest" : "bg-white border-sage-pale text-forest/70 hover:border-forest/30"}`}
        >
          <Filter className="w-4 h-4" />
          Diet {activeDiet.length > 0 && `(${activeDiet.length})`}
        </button>
      </div>

      {/* Diet filter pills */}
      {showFilters && (
        <div className="bg-white border border-sage-pale rounded-2xl p-4 mb-4">
          <p className="text-xs font-semibold text-forest/50 uppercase tracking-wide mb-3">Filter by Diet</p>
          <div className="flex flex-wrap gap-2">
            {DIET_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleDiet(tag)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${activeDiet.includes(tag) ? "bg-forest text-white" : "bg-sage-pale text-forest/70 hover:bg-sage"}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category tabs */}
      <div className="flex gap-1 overflow-x-auto pb-2 mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`shrink-0 text-sm px-4 py-2 rounded-lg font-medium transition-colors ${category === cat ? "bg-forest text-white" : "text-forest/60 hover:bg-sage-pale"}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results count */}
      {!loading && (
        <p className="text-xs text-forest/40 mb-4">{total} recipe{total !== 1 ? "s" : ""} found</p>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-sage-pale overflow-hidden animate-pulse">
              <div className="aspect-[4/3] bg-sage-pale" />
              <div className="p-3 space-y-2">
                <div className="h-3 bg-sage-pale rounded w-3/4" />
                <div className="h-3 bg-sage-pale rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : recipes.length === 0 ? (
        <div className="text-center py-20">
          <ChefHat className="w-12 h-12 text-forest/20 mx-auto mb-3" />
          <p className="text-forest/40 text-lg">No recipes found.</p>
          <button onClick={() => { setSearch(""); setCategory("All"); setActiveDiet([]); }} className="mt-3 text-green text-sm hover:underline">
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {recipes.map((recipe) => (
            <Link
              key={recipe.slug}
              href={`/recipes/${recipe.slug}`}
              className="bg-white rounded-2xl overflow-hidden border border-sage-pale hover:shadow-lg transition-shadow group flex flex-col"
            >
              <div className="aspect-[4/3] bg-sage-pale overflow-hidden relative">
                {recipe.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ChefHat className="w-10 h-10 text-forest/20" />
                  </div>
                )}
                <span className="absolute top-2 left-2 text-[10px] bg-white/90 text-forest/70 px-2 py-0.5 rounded-full font-medium">
                  {recipe.difficulty}
                </span>
              </div>

              <div className="p-3 flex flex-col flex-1">
                <div className="flex flex-wrap gap-1 mb-2">
                  {recipe.dietTags.slice(0, 2).map((tag) => (
                    <span key={tag} className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-sage-pale text-forest/70">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="font-semibold text-forest text-sm leading-snug mb-1 line-clamp-2">{recipe.title}</h3>
                <p className="text-xs text-forest/50 line-clamp-2 flex-1 mb-3">{recipe.excerpt}</p>
                <div className="flex items-center gap-3 text-xs text-forest/40">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{recipe.prepTime}m</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" />{recipe.servings}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 rounded-lg border border-sage-pale text-sm text-forest/60 hover:bg-sage-pale disabled:opacity-40">Previous</button>
          <span className="px-4 py-2 text-sm text-forest/60">{page} / {pages}</span>
          <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages} className="px-4 py-2 rounded-lg border border-sage-pale text-sm text-forest/60 hover:bg-sage-pale disabled:opacity-40">Next</button>
        </div>
      )}
    </div>
  );
}
