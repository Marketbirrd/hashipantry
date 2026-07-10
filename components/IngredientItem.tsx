"use client";

import { useState, useRef } from "react";
import { ShoppingBag, X, Plus, Check, Info } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

type MatchedProduct = {
  id: string;
  name: string;
  description?: string;
  imageUrl: string;
  affiliateUrl: string;
  asin?: string | null;
  dietTags?: string[];
};

type Props = {
  amount: string;
  name: string;
  original: string;
  matches: MatchedProduct[];
};

function ProductCard({ product }: { product: MatchedProduct }) {
  const { addItem, items } = useCart();
  const [hovered, setHovered] = useState(false);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inCart = items.some((i) => i.id === product.id);

  const showTooltip = () => {
    hoverTimeout.current = setTimeout(() => setHovered(true), 200);
  };
  const hideTooltip = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setHovered(false);
  };

  const hasDetails = product.description || (product.dietTags && product.dietTags.length > 0);

  return (
    <div
      className="relative flex items-center gap-3 p-3 bg-cream rounded-xl"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {/* Hover card */}
      {hovered && hasDetails && (
        <div className="absolute bottom-full left-0 right-0 mb-2 z-10 pointer-events-none">
          <div className="bg-forest text-white rounded-xl p-3 shadow-xl text-xs leading-relaxed">
            {product.description && (
              <p className="text-white/90 mb-2">{product.description}</p>
            )}
            {product.dietTags && product.dietTags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {product.dietTags.slice(0, 6).map((tag) => (
                  <span key={tag} className="bg-white/20 text-white px-1.5 py-0.5 rounded-full text-[10px] font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            {/* Arrow */}
            <div className="absolute top-full left-6 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-forest" />
          </div>
        </div>
      )}

      {/* Product image */}
      <div className="w-12 h-12 rounded-lg overflow-hidden bg-sage-pale shrink-0">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-forest/20" />
          </div>
        )}
      </div>

      {/* Name + info hint */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-forest line-clamp-2 leading-snug">{product.name}</p>
        {hasDetails && (
          <p className="text-[10px] text-forest/40 mt-0.5 flex items-center gap-0.5">
            <Info className="w-2.5 h-2.5" /> hover for details
          </p>
        )}
      </div>

      {/* Add to cart */}
      <button
        onClick={() =>
          addItem({
            id: product.id,
            name: product.name,
            imageUrl: product.imageUrl,
            affiliateUrl: product.affiliateUrl,
            asin: product.asin,
            source: "AMAZON",
          })
        }
        className={`shrink-0 p-2 rounded-lg transition-colors ${
          inCart ? "bg-green-100 text-green-700" : "bg-forest text-white hover:bg-forest-light"
        }`}
      >
        {inCart ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
      </button>
    </div>
  );
}

export default function IngredientItem({ amount, name, original, matches }: Props) {
  const [open, setOpen] = useState(false);
  const hasMatches = matches.length > 0;

  return (
    <li className="flex items-start gap-3 text-sm">
      <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-green mt-2" />
      <span className="flex-1">
        {amount && <span className="font-medium text-forest">{amount} </span>}
        {hasMatches ? (
          <button
            onClick={() => setOpen(true)}
            className="text-green hover:underline inline-flex items-center gap-1 font-medium"
          >
            {name}
            <ShoppingBag className="w-3 h-3 opacity-60" />
          </button>
        ) : (
          <span className="text-forest/70">{name}</span>
        )}
        {original && !amount && <span className="text-forest/50"> — {original}</span>}
      </span>

      {/* Product match popup */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-5 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif font-bold text-forest text-lg">Shop: {name}</h3>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-lg hover:bg-sage-pale transition-colors"
              >
                <X className="w-4 h-4 text-forest/60" />
              </button>
            </div>

            <div className="space-y-3">
              {matches.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <p className="text-xs text-forest/40 mt-4 text-center">
              Items added to your HashiPantry cart
            </p>
          </div>
        </div>
      )}
    </li>
  );
}
