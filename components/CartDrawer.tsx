"use client";

import { useCart } from "@/contexts/CartContext";
import { X, ShoppingBag, ExternalLink, Plus, Minus } from "lucide-react";

type Props = { open: boolean; onClose: () => void };

export default function CartDrawer({ open, onClose }: Props) {
  const { items, removeItem, updateQuantity, clearCart } = useCart();

  const handleAmazonCheckout = () => {
    items.forEach((item) => window.open(item.affiliateUrl, "_blank"));
  };

  if (!open) return null;

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50 transition-opacity" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-sage-light/30">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-forest" />
            <span className="font-semibold text-forest">Your Cart ({totalItems})</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-sage-pale transition-colors">
            <X className="w-5 h-5 text-forest" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-12 h-12 text-sage mx-auto mb-3 opacity-40" />
              <p className="text-forest/60 text-sm">Your cart is empty</p>
              <p className="text-forest/40 text-xs mt-1">Browse the shop to add products</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-3 p-3 bg-cream rounded-lg">
                <div className="w-14 h-14 rounded-md overflow-hidden bg-sage-pale shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-forest line-clamp-2 leading-snug mb-2">
                    {item.name}
                  </p>
                  {/* Quantity controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 rounded-full border border-sage-pale flex items-center justify-center text-forest/60 hover:text-forest hover:border-forest/40 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-semibold text-forest w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 rounded-full border border-sage-pale flex items-center justify-center text-forest/60 hover:text-forest hover:border-forest/40 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="ml-auto text-xs text-forest/30 hover:text-red-400 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-sage-light/30 space-y-2">
            <button
              onClick={handleAmazonCheckout}
              className="w-full bg-forest text-white py-3 rounded-xl font-semibold text-sm hover:bg-forest-light transition-colors flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Shop these on Amazon
            </button>
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
