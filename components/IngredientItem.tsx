"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, X, Plus, Check } from "lucide-react";
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
  const inCart = items.some((i) => i.id === product.id);

  return (
    <div className="flex items-center gap-3 p-3 bg-cream rounded-xl">
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

      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-forest line-clamp-2 leading-snug">{product.name}</p>
        {product.dietTags && product.dietTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {product.dietTags.slice(0, 4).map((tag) => (
              <span key={tag} className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-sage-pale text-forest/60">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

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
        aria-label={inCart ? "In cart" : "Add to cart"}
      >
        {inCart ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
      </button>
    </div>
  );
}

export default function IngredientItem({ amount, name, original, matches }: Props) {
  const { addItem, items } = useCart();
  const [open, setOpen] = useState(false);
  const hasMatches = matches.length > 0;

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  const handleAddAll = () => {
    for (const product of matches) {
      if (!items.some((i) => i.id === product.id)) {
        addItem({
          id: product.id,
          name: product.name,
          imageUrl: product.imageUrl,
          affiliateUrl: product.affiliateUrl,
          asin: product.asin,
          source: "AMAZON",
        });
      }
    }
  };

  const allInCart = matches.length > 0 && matches.every((p) => items.some((i) => i.id === p.id));

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
                aria-label="Close"
              >
                <X className="w-4 h-4 text-forest/60" />
              </button>
            </div>

            <div className="space-y-3">
              {matches.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {matches.length > 1 && (
              <button
                onClick={handleAddAll}
                disabled={allInCart}
                className={`mt-4 w-full py-2.5 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 ${
                  allInCart
                    ? "bg-green-100 text-green-700"
                    : "bg-forest text-white hover:bg-forest-light"
                }`}
              >
                {allInCart ? (
                  <><Check className="w-4 h-4" /> All in cart</>
                ) : (
                  <><Plus className="w-4 h-4" /> Add all to cart</>
                )}
              </button>
            )}

            <p className="text-xs text-forest/40 mt-3 text-center">
              Items added to your HashiPantry cart
            </p>
          </div>
        </div>
      )}
    </li>
  );
}
