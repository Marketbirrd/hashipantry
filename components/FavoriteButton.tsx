"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

type ProductTarget = { kind: "product"; productId: string; productName: string; affiliateUrl: string; imageUrl?: string };
type RecipeTarget = { kind: "recipe"; recipeSlug: string; recipeTitle: string; imageUrl?: string };

/** Save / unsave button for product and recipe detail pages. */
export default function FavoriteButton({ target, className = "" }: { target: ProductTarget | RecipeTarget; className?: string }) {
  const { data: session, status } = useSession();
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  const isProduct = target.kind === "product";
  const key = isProduct ? target.productId : target.recipeSlug;
  const endpoint = isProduct ? "/api/account/favorites/products" : "/api/account/favorites/recipes";

  useEffect(() => {
    if (!session?.user) return;
    fetch(endpoint)
      .then((r) => r.json())
      .then((d) => {
        const list: Record<string, string>[] = d.favorites ?? [];
        setSaved(list.some((f) => (isProduct ? f.productId : f.recipeSlug) === key));
      })
      .catch(() => {});
  }, [session, endpoint, key, isProduct]);

  const toggle = async () => {
    if (busy) return;
    setBusy(true);
    const next = !saved;
    setSaved(next);
    try {
      if (next) {
        const { kind: _kind, ...body } = target;
        void _kind;
        const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        if (!res.ok) throw new Error();
      } else {
        const param = isProduct ? `productId=${encodeURIComponent(key)}` : `recipeSlug=${encodeURIComponent(key)}`;
        const res = await fetch(`${endpoint}?${param}`, { method: "DELETE" });
        if (!res.ok) throw new Error();
      }
    } catch {
      setSaved(!next);
    } finally {
      setBusy(false);
    }
  };

  const base = `inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${className}`;

  if (status !== "authenticated") {
    return (
      <Link href="/login" className={`${base} border-forest/20 text-forest/70 hover:border-forest/40 hover:bg-white`}>
        <Heart className="w-4 h-4" /> Sign in to save
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={saved}
      className={`${base} ${saved ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100" : "border-forest/20 text-forest/70 hover:border-forest/40 hover:bg-white"}`}
    >
      <Heart className={`w-4 h-4 ${saved ? "fill-red-500 text-red-500" : ""}`} />
      {saved ? "Saved to Favorites" : "Save to Favorites"}
    </button>
  );
}
