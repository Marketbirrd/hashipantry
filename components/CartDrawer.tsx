"use client";

import { useCart } from "@/contexts/CartContext";
import { X, ShoppingBag, ExternalLink, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type Props = { open: boolean; onClose: () => void };

export default function CartDrawer({ open, onClose }: Props) {
  const { items, removeItem, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  const handleAmazonCheckout = async () => {
    const amazonItems = items.filter((i) => i.source === "AMAZON" && i.asin);
    if (amazonItems.length === 0) return;

    setLoading(true);
    try {
      const res = await fetch("/api/amazon-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ asins: amazonItems.map((i) => i.asin) }),
      });
      const data = await res.json();
      if (data.url) {
        window.open(data.url, "_blank");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const amazonItems = items.filter((i) => i.source === "AMAZON");
  const thriveItems = items.filter((i) => i.source === "THRIVE");

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-50 transition-opacity"
        onClick={onClose}
      />
      <div className="fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-sage-light/30">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-forest" />
            <span className="font-semibold text-forest">
              Your Cart ({items.length})
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-sage-pale transition-colors"
          >
            <X className="w-5 h-5 text-forest" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-12 h-12 text-sage mx-auto mb-3 opacity-40" />
              <p className="text-forest/60 text-sm">Your cart is empty</p>
              <p className="text-forest/40 text-xs mt-1">
                Browse the shop to add products
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 p-3 bg-cream rounded-lg"
              >
                <div className="w-14 h-14 rounded-md overflow-hidden bg-sage-pale shrink-0 relative">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-forest line-clamp-2 leading-snug">
                    {item.name}
                  </p>
                  <span
                    className={`inline-block mt-1 text-xs px-1.5 py-0.5 rounded-full font-medium ${
                      item.source === "AMAZON"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {item.source === "AMAZON" ? "Amazon" : "Thrive Market"}
                  </span>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-1 text-forest/40 hover:text-red-500 transition-colors shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer actions */}
        {items.length > 0 && (
          <div className="p-4 border-t border-sage-light/30 space-y-2">
            {amazonItems.length > 0 && (
              <button
                onClick={handleAmazonCheckout}
                disabled={loading}
                className="w-full bg-forest text-white py-3 rounded-xl font-semibold text-sm hover:bg-forest-light transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                {loading
                  ? "Building cart…"
                  : `Checkout ${amazonItems.length} Amazon item${amazonItems.length > 1 ? "s" : ""}`}
              </button>
            )}
            {thriveItems.length > 0 && (
              <div className="space-y-1">
                {thriveItems.map((item) => (
                  <a
                    key={item.id}
                    href={item.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full border border-green-600 text-green-700 py-2.5 rounded-xl font-medium text-sm hover:bg-green-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View on Thrive Market
                  </a>
                ))}
              </div>
            )}
            <button
              onClick={clearCart}
              className="w-full text-forest/50 text-xs py-1.5 hover:text-forest/80 transition-colors"
            >
              Clear cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
