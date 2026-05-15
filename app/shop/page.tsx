"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/products-data";
import { useSession } from "next-auth/react";

const DIET_FILTERS = [
  "Gluten Free", "Dairy Free", "Soy Free", "Egg Free", "Nut Free",
  "AIP", "Paleo", "Vegan", "Grain Free", "No Seed Oils", "Low Histamine",
];

const CATEGORIES = [
  "All", "Oils & Fats", "Flours & Baking", "Snacks", "Condiments",
  "Pantry Staples", "Beverages", "Supplements",
];

const SOURCES = ["All", "Amazon", "Thrive Market"];

type ApiResponse = { items: Product[]; total: number; page: number; pages: number };

export default function ShopPage() {
  const { data: session } = useSession();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeDiet, setActiveDiet] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeSource, setActiveSource] = useState("All");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Auto-load saved diet prefs when logged in
  useEffect(() => {
    if (session) {
      fetch("/api/account/prefs")
        .then((r) => r.json())
        .then((d) => { if (d.dietPrefs?.length) setActiveDiet(d.dietPrefs); });
    }
  }, [session]);

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  // Reset to page 1 whenever filters change
  useEffect(() => { setPage(1); }, [debouncedSearch, activeDiet, activeCategory, activeSource]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "48" });
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (activeCategory !== "All") params.set("category", activeCategory);
    if (activeSource !== "All") params.set("source", activeSource);
    activeDiet.forEach((tag) => params.append("diet", tag));

    const res = await fetch(`/api/products?${params}`);
    const json = await res.json();
    setData(json);
    setLoading(false);
  }, [page, debouncedSearch, activeDiet, activeCategory, activeSource]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const toggleDiet = (tag: string) =>
    setActiveDiet((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );

  const clearAll = () => {
    setActiveDiet([]);
    setActiveCategory("All");
    setActiveSource("All");
    setSearch("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold text-forest">Shop</h1>
        <p className="text-forest/60 text-sm mt-1">
          Every product is 100% vetted and Hashimoto&apos;s-friendly.
        </p>
      </div>

      {/* Search bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-forest/40" />
        <input
          type="text"
          placeholder="Search products…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-sage-pale rounded-xl text-forest placeholder-forest/40 text-sm focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X className="w-4 h-4 text-forest/40" />
          </button>
        )}
      </div>

      <div className="flex gap-6">
        {/* Filter sidebar — desktop */}
        <aside className="hidden lg:block w-56 shrink-0 space-y-6">
          <div>
            <h3 className="text-xs font-semibold text-forest/50 uppercase tracking-wide mb-3">Source</h3>
            <div className="space-y-1.5">
              {SOURCES.map((s) => (
                <button
                  key={s}
                  onClick={() => setActiveSource(s)}
                  className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${
                    activeSource === s ? "bg-forest text-white font-medium" : "text-forest/70 hover:bg-sage-pale"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-forest/50 uppercase tracking-wide mb-3">Category</h3>
            <div className="space-y-1.5">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setActiveCategory(c)}
                  className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${
                    activeCategory === c ? "bg-forest text-white font-medium" : "text-forest/70 hover:bg-sage-pale"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-forest/50 uppercase tracking-wide mb-3">Diet Type</h3>
            <div className="space-y-1.5">
              {DIET_FILTERS.map((tag) => (
                <label key={tag} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={activeDiet.includes(tag)}
                    onChange={() => toggleDiet(tag)}
                    className="w-4 h-4 rounded accent-forest"
                  />
                  <span className="text-sm text-forest/70 group-hover:text-forest">{tag}</span>
                </label>
              ))}
            </div>
          </div>

          {(activeDiet.length > 0 || activeCategory !== "All" || activeSource !== "All") && (
            <button onClick={clearAll} className="text-xs text-green hover:underline">
              Clear all filters
            </button>
          )}
        </aside>

        {/* Main content */}
        <div className="flex-1">
          {/* Mobile filter toggle */}
          <div className="lg:hidden mb-4 flex items-center justify-between">
            <p className="text-sm text-forest/60">{data ? `${data.total.toLocaleString()} products` : "Loading…"}</p>
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center gap-2 text-sm font-medium text-forest border border-sage-pale px-3 py-1.5 rounded-lg"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
          </div>

          {/* Mobile filters panel */}
          {filtersOpen && (
            <div className="lg:hidden mb-6 p-4 bg-white border border-sage-pale rounded-xl space-y-5">
              <div>
                <h3 className="text-xs font-semibold text-forest/50 uppercase tracking-wide mb-2">Source</h3>
                <div className="flex flex-wrap gap-2">
                  {SOURCES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setActiveSource(s)}
                      className={`text-sm px-3 py-1 rounded-full border transition-colors ${
                        activeSource === s ? "bg-forest text-white border-forest" : "text-forest/70 border-sage-pale"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-forest/50 uppercase tracking-wide mb-2">Category</h3>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c}
                      onClick={() => setActiveCategory(c)}
                      className={`text-sm px-3 py-1 rounded-full border transition-colors ${
                        activeCategory === c ? "bg-forest text-white border-forest" : "text-forest/70 border-sage-pale"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-forest/50 uppercase tracking-wide mb-2">Diet Type</h3>
                <div className="flex flex-wrap gap-2">
                  {DIET_FILTERS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleDiet(tag)}
                      className={`text-sm px-3 py-1 rounded-full border transition-colors ${
                        activeDiet.includes(tag) ? "bg-forest text-white border-forest" : "text-forest/70 border-sage-pale"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              {(activeDiet.length > 0 || activeCategory !== "All" || activeSource !== "All") && (
                <button onClick={clearAll} className="text-xs text-green hover:underline">
                  Clear all filters
                </button>
              )}
            </div>
          )}

          {/* Active diet tag pills */}
          {activeDiet.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4 items-center">
              {session && (
                <span className="text-xs text-forest/40 italic mr-1">Your saved preferences:</span>
              )}
              {activeDiet.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleDiet(tag)}
                  className="flex items-center gap-1 text-xs bg-forest text-white px-3 py-1 rounded-full"
                >
                  {tag} <X className="w-3 h-3" />
                </button>
              ))}
            </div>
          )}

          <p className="hidden lg:block text-sm text-forest/50 mb-4">
            {loading ? "Loading…" : data ? `${data.total.toLocaleString()} products` : ""}
          </p>

          {/* Product grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="bg-cream rounded-2xl overflow-hidden border border-sage-pale animate-pulse">
                  <div className="aspect-square bg-sage-pale" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-sage-pale rounded w-3/4" />
                    <div className="h-3 bg-sage-pale rounded w-1/2" />
                    <div className="mt-3 h-9 bg-forest/10 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          ) : !data || data.items.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-forest/40 text-lg">No products match your filters.</p>
              <button onClick={clearAll} className="mt-3 text-green text-sm hover:underline">
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {data.items.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {data.pages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-lg border border-sage-pale text-forest/60 hover:bg-sage-pale disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-forest/60">
                    Page {page} of {data.pages.toLocaleString()}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(data.pages, p + 1))}
                    disabled={page === data.pages}
                    className="p-2 rounded-lg border border-sage-pale text-forest/60 hover:bg-sage-pale disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
