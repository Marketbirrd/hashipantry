"use client";

import { ShoppingBag, Heart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  affiliateUrl: string;
  source: "AMAZON";
  asin?: string | null;
  category: string;
  dietTags: string[];
};

export default function ProductCard({ product }: { product: Product }) {
  const { addItem, items } = useCart();
  const { data: session } = useSession();
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const inCart = items.some((i) => i.id === product.id);

  // Check if already favorited
  useEffect(() => {
    if (!session?.user) return;
    fetch("/api/account/favorites/products")
      .then((r) => r.json())
      .then((d) => {
        if (d.favorites?.some((f: { productId: string }) => f.productId === product.id)) {
          setFavorited(true);
        }
      })
      .catch(() => {});
  }, [session, product.id]);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({ id: product.id, name: product.name, imageUrl: product.imageUrl, affiliateUrl: product.affiliateUrl, asin: product.asin, source: product.source });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!session?.user) return;
    if (favorited) {
      setFavorited(false);
      await fetch(`/api/account/favorites/products?productId=${product.id}`, { method: "DELETE" });
    } else {
      setFavorited(true);
      await fetch("/api/account/favorites/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, productName: product.name, affiliateUrl: product.affiliateUrl, imageUrl: product.imageUrl }),
      });
    }
  };

  return (
    <Link href={`/shop/${product.id}`} className="bg-white rounded-2xl overflow-hidden border border-sage-pale hover:shadow-lg transition-shadow group flex flex-col">
      {/* Image */}
      <div className="relative aspect-square bg-sage-pale overflow-hidden">
        {!imgError && product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onError={() => setImgError(true)} />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag className="w-10 h-10 text-forest/20" />
          </div>
        )}
        {session?.user && (
          <button
            onClick={toggleFavorite}
            className={`absolute top-2 right-2 p-1.5 rounded-full transition-colors shadow-sm ${favorited ? "bg-red-50 text-red-500" : "bg-white/80 text-forest/30 hover:text-red-400"}`}
          >
            <Heart className={`w-3.5 h-3.5 ${favorited ? "fill-red-500" : ""}`} />
          </button>
        )}
      </div>

      <div className="p-3 flex flex-col flex-1">
        <div className="flex flex-wrap gap-1 mb-2">
          {product.dietTags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-[10px] bg-sage-pale text-forest/70 px-1.5 py-0.5 rounded-full">{tag}</span>
          ))}
        </div>
        <p className="text-sm font-semibold text-forest leading-snug mb-1 line-clamp-2">{product.name}</p>
        <p className="text-xs text-forest/50 leading-relaxed line-clamp-2 flex-1 mb-3">{product.description}</p>
        <button
          onClick={handleAdd}
          disabled={inCart}
          className={`w-full flex items-center justify-center gap-1.5 text-xs font-semibold py-2.5 rounded-xl transition-colors ${inCart || added ? "bg-sage text-white" : "bg-forest text-white hover:bg-forest-light"}`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          {added ? "Added!" : inCart ? "In Cart" : "Add to Cart"}
        </button>
      </div>
    </Link>
  );
}
