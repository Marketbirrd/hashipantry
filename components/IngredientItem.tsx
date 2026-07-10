"use client";

import { useState } from "react";
import { ShoppingBag, X, Plus, Check } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

type MatchedProduct = {
  id: string;
  name: string;
  imageUrl: string;
  affiliateUrl: string;
  asin?: string | null;
};

type Props = {
  amount: string;
  name: string;
  original: string;
  matches: MatchedProduct[];
};

export default function IngredientItem({ amount, name, original, matches }: Props) {
  const [open, setOpen] = useState(false);
  const { addItem, items } = useCart();

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-5 z-10" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif font-bold text-forest text-lg">Shop: {name}</h3>
              <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-sage-pale transition-colors">
                <X className="w-4 h-4 text-forest/60" />
              </button>
            </div>

            <div className="space-y-3">
              {matches.map((product) => {
                const inCart = items.some((i) => i.id === product.id);
                return (
                  <div key={product.id} className="flex items-center gap-3 p-3 bg-cream rounded-xl">
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
                    </div>
                    <button
                      onClick={() => {
                        addItem({ id: product.id, name: product.name, imageUrl: product.imageUrl, affiliateUrl: product.affiliateUrl, asin: product.asin, source: "AMAZON" });
                      }}
                      className={`shrink-0 p-2 rounded-lg transition-colors ${inCart ? "bg-green-100 text-green-700" : "bg-forest text-white hover:bg-forest-light"}`}
                    >
                      {inCart ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </button>
                  </div>
                );
              })}
            </div>

            <p className="text-xs text-forest/40 mt-4 text-center">Items added to your HashiPantry cart</p>
          </div>
        </div>
      )}
    </li>
  );
}
