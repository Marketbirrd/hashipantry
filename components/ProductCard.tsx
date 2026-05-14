"use client";

import { ShoppingBag, ExternalLink } from "lucide-react";
import { useCart, type CartItem } from "@/contexts/CartContext";
import { useState } from "react";

type Product = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  affiliateUrl: string;
  source: "AMAZON" | "THRIVE";
  asin?: string | null;
  category: string;
  dietTags: string[];
};

export default function ProductCard({ product }: { product: Product }) {
  const { addItem, items } = useCart();
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const inCart = items.some((i) => i.id === product.id);

  const handleAdd = () => {
    const item: CartItem = {
      id: product.id,
      name: product.name,
      imageUrl: product.imageUrl,
      affiliateUrl: product.affiliateUrl,
      asin: product.asin,
      source: product.source,
    };
    addItem(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-sage-pale hover:shadow-lg transition-shadow group flex flex-col">
      {/* Image */}
      <div className="relative aspect-square bg-sage-pale overflow-hidden">
        {!imgError && product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag className="w-10 h-10 text-forest/20" />
          </div>
        )}
        {/* Source badge */}
        <span
          className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
            product.source === "AMAZON"
              ? "bg-amber-100 text-amber-800"
              : "bg-emerald-100 text-emerald-800"
          }`}
        >
          {product.source === "AMAZON" ? "Amazon" : "Thrive"}
        </span>
      </div>

      <div className="p-3 flex flex-col flex-1">
        {/* Diet tags */}
        <div className="flex flex-wrap gap-1 mb-2">
          {product.dietTags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] bg-sage-pale text-forest/70 px-1.5 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Name */}
        <p className="text-sm font-semibold text-forest leading-snug mb-1 line-clamp-2">
          {product.name}
        </p>

        {/* Description */}
        <p className="text-xs text-forest/50 leading-relaxed line-clamp-2 flex-1 mb-3">
          {product.description}
        </p>

        {/* Action button */}
        {product.source === "THRIVE" ? (
          <a
            href={product.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-1.5 bg-emerald-600 text-white text-xs font-semibold py-2.5 rounded-xl hover:bg-emerald-700 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" /> View on Thrive
          </a>
        ) : (
          <button
            onClick={handleAdd}
            disabled={inCart}
            className={`w-full flex items-center justify-center gap-1.5 text-xs font-semibold py-2.5 rounded-xl transition-colors ${
              inCart || added
                ? "bg-sage text-white"
                : "bg-forest text-white hover:bg-forest-light"
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            {added ? "Added!" : inCart ? "In Cart" : "Add to Cart"}
          </button>
        )}
      </div>
    </div>
  );
}
