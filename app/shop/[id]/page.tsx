"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingBag, ExternalLink, ArrowLeft, Plus, Minus, Check } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

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
  featured: boolean;
};

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { addItem, items, updateQuantity } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const cartItem = items.find((i) => i.id === id);
  const inCart = !!cartItem;

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((d) => { setProduct(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const handleAdd = () => {
    if (!product) return;
    if (inCart) {
      updateQuantity(product.id, (cartItem?.quantity ?? 0) + quantity);
    } else {
      for (let i = 0; i < quantity; i++) {
        addItem({
          id: product.id,
          name: product.name,
          imageUrl: product.imageUrl,
          affiliateUrl: product.affiliateUrl,
          asin: product.asin,
          source: product.source,
        });
      }
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-forest border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-4">
        <p className="text-forest/60">Product not found.</p>
        <Link href="/shop" className="text-forest font-medium hover:underline">← Back to Shop</Link>
      </div>
    );
  }

  const ingredients = product.description;

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Back link */}
        <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-forest/60 hover:text-forest mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </button>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Image */}
          <div className="bg-white rounded-3xl overflow-hidden border border-sage-pale aspect-square flex items-center justify-center">
            {!imgError && product.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-contain p-6"
                onError={() => setImgError(true)}
              />
            ) : (
              <ShoppingBag className="w-20 h-20 text-forest/20" />
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            {/* Category */}
            <p className="text-xs font-semibold text-forest/40 uppercase tracking-widest mb-2">{product.category}</p>

            {/* Name */}
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest leading-tight mb-4">
              {product.name}
            </h1>

            {/* Diet tags */}
            <div className="flex flex-wrap gap-1.5 mb-6">
              {product.dietTags.map((tag) => (
                <span key={tag} className="text-xs bg-sage-pale text-forest/70 px-2.5 py-1 rounded-full font-medium">
                  {tag}
                </span>
              ))}
            </div>

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center border border-sage-pale rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2.5 text-forest/60 hover:text-forest hover:bg-sage-pale transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2.5 text-forest font-semibold text-sm min-w-[2.5rem] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-2.5 text-forest/60 hover:text-forest hover:bg-sage-pale transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAdd}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
                  added ? "bg-green-600 text-white" : "bg-forest text-white hover:bg-forest-light"
                }`}
              >
                {added ? <><Check className="w-4 h-4" /> Added to Cart</> : <><ShoppingBag className="w-4 h-4" /> Add to Cart</>}
              </button>
            </div>

            {inCart && (
              <p className="text-xs text-forest/50 mb-4">
                Already in cart: {cartItem.quantity} item{cartItem.quantity > 1 ? "s" : ""}
              </p>
            )}

            {/* View on Amazon */}
            <a
              href={product.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 border border-forest/20 text-forest/70 py-2.5 rounded-xl text-sm font-medium hover:bg-white hover:border-forest/40 transition-colors mb-8"
            >
              <ExternalLink className="w-4 h-4" /> View full details on Amazon
            </a>

            {/* Ingredients */}
            <div className="bg-white rounded-2xl border border-sage-pale p-5">
              <h2 className="font-semibold text-forest mb-2 text-sm uppercase tracking-wide">Ingredients</h2>
              <p className="text-sm text-forest/70 leading-relaxed">{ingredients}</p>
              <p className="text-xs text-forest/40 mt-3 italic">
                For full nutritional information, allergen details, and serving size, view the product on Amazon.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
