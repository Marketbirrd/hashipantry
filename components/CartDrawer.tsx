"use client";

import { useCart } from "@/contexts/CartContext";
import { X, ShoppingBag, ExternalLink, Plus, Minus, Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";

type Props = { open: boolean; onClose: () => void };

function CartImage({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false);
  if (error || !src) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-sage-pale">
        <ShoppingBag className="w-6 h-6 text-forest/20" />
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className="w-full h-full object-cover" onError={() => setError(true)} />
  );
}

type SkippedItem = { id: string; name: string; affiliateUrl: string };

export default function CartDrawer({ open, onClose }: Props) {
  const { items, removeItem, updateQuantity, clearCart } = useCart();
  const { data: session } = useSession();
  const [step, setStep] = useState<"cart" | "confirm" | "sent">("cart");
  const [loading, setLoading] = useState(false);
  const [skippedItems, setSkippedItems] = useState<SkippedItem[]>([]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const pricedItems = items.filter((i) => i.price != null);
  const subtotal = pricedItems.reduce((sum, i) => sum + (i.price! * i.quantity), 0);
  const hasAllPrices = items.length > 0 && pricedItems.length === items.length;
  const noAsinItems = items.filter(
    (i) => !i.asin && !i.affiliateUrl?.match(/\/dp\/[A-Z0-9]{10}/i)
  );

  const handleConfirmCheckout = async () => {
    setLoading(true);

    // Open popup before async work to bypass popup blocker
    const w = Math.min(1100, screen.width - 100);
    const h = Math.min(900, screen.height - 100);
    const popup = window.open(
      "about:blank", "amazon-cart",
      `width=${w},height=${h},left=${Math.round((screen.width - w) / 2)},top=${Math.round((screen.height - h) / 2)},resizable=yes,scrollbars=yes`
    );

    try {
      // Save to purchase history if signed in (fire-and-forget, don't block checkout)
      if (session?.user) {
        fetch("/api/account/purchases", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: items.map((i) => ({
              id: i.id,
              name: i.name,
              imageUrl: i.imageUrl,
              affiliateUrl: i.affiliateUrl,
              quantity: i.quantity,
            })),
          }),
        })
          .then((r) => { if (r.ok) window.dispatchEvent(new Event("hashi:shopping-lists-updated")); })
          .catch(() => {});
      }

      // Build Amazon cart URL
      const res = await fetch("/api/amazon-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: items.map((i) => ({ id: i.id, quantity: i.quantity })) }),
      });
      const data = await res.json();
      setSkippedItems(data.skipped ?? []);
      if (data.cartUrl && popup) {
        popup.location.href = data.cartUrl;
      } else if (popup) {
        popup.close();
      }
      setStep("sent");
    } catch {
      if (popup) popup.close();
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep("cart");
    setSkippedItems([]);
    onClose();
  };

  const handleClearAndClose = () => {
    clearCart();
    setStep("cart");
    setSkippedItems([]);
    onClose();
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50" onClick={handleClose} />
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="shrink-0 flex items-center justify-between p-4 border-b border-sage-light/30">
          <div className="flex items-center gap-2">
            {step === "confirm" ? (
              <button onClick={() => setStep("cart")} className="p-1 -ml-1 rounded-md hover:bg-sage-pale transition-colors">
                <ArrowLeft className="w-4 h-4 text-forest" />
              </button>
            ) : (
              <ShoppingBag className="w-5 h-5 text-forest" />
            )}
            <span className="font-semibold text-forest">
              {step === "confirm" ? "Review Your List" : `Your Cart (${totalItems})`}
            </span>
          </div>
          <button onClick={handleClose} className="p-1.5 rounded-md hover:bg-sage-pale transition-colors">
            <X className="w-5 h-5 text-forest" />
          </button>
        </div>

        {step === "sent" ? (
          <>
            <div className="flex-1 overflow-y-auto p-5 min-h-0 space-y-5">
              {skippedItems.length < items.length ? (
                /* Some or all items went to Amazon cart */
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-green/10 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-7 h-7 text-green" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-forest mb-1">Amazon is open!</h3>
                  <p className="text-sm text-forest/55 leading-snug">
                    Your cart was sent to Amazon. Finish your purchase there.
                  </p>
                </div>
              ) : (
                /* All items were skipped */
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-3">
                    <ShoppingBag className="w-7 h-7 text-amber-500" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-forest mb-1">Find on Amazon</h3>
                  <p className="text-sm text-forest/55 leading-snug">
                    These products don&apos;t have direct cart links yet. Click each one to search for it on Amazon.
                  </p>
                </div>
              )}

              {skippedItems.length > 0 && (
                <div>
                  {skippedItems.length < items.length && (
                    <p className="text-xs font-semibold text-forest/40 uppercase tracking-wide mb-2">
                      Also find these on Amazon
                    </p>
                  )}
                  <div className="space-y-2">
                    {skippedItems.map((item) => (
                      <a
                        key={item.id}
                        href={item.affiliateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-cream rounded-lg hover:bg-sage-pale transition-colors group"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-forest line-clamp-2 leading-snug">{item.name}</p>
                        </div>
                        <span className="shrink-0 text-xs font-semibold text-green group-hover:underline flex items-center gap-1">
                          Find on Amazon <ExternalLink className="w-3 h-3" />
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="shrink-0 p-4 border-t border-sage-light/30 space-y-2 bg-white">
              <button
                onClick={handleClearAndClose}
                className="w-full bg-forest text-white py-3 rounded-xl font-semibold text-sm hover:bg-forest-light transition-colors"
              >
                Clear cart &amp; close
              </button>
              <button onClick={handleClose} className="w-full text-forest/50 text-xs py-1.5 hover:text-forest/80 transition-colors">
                Keep cart &amp; close
              </button>
            </div>
          </>
        ) : step === "cart" ? (
          <>
            {/* Cart items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-12 h-12 text-sage mx-auto mb-3 opacity-40" />
                  <p className="text-forest/60 text-sm">Your cart is empty</p>
                  <p className="text-forest/40 text-xs mt-1">Browse the shop to add products</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-3 p-3 bg-cream rounded-lg">
                    <div className="w-16 h-16 rounded-md overflow-hidden shrink-0">
                      <CartImage src={item.imageUrl} alt={item.name} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-forest line-clamp-2 leading-snug mb-1">{item.name}</p>
                      {item.price != null ? (
                        <p className="text-xs font-semibold text-forest mb-1.5">
                          ${(item.price * item.quantity).toFixed(2)}
                          {item.quantity > 1 && <span className="text-forest/40 font-normal ml-1">(${item.price.toFixed(2)} ea)</span>}
                        </p>
                      ) : (
                        <p className="text-xs text-forest/40 mb-1.5">Price on Amazon</p>
                      )}
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 rounded-full border border-sage-pale flex items-center justify-center text-forest/60 hover:text-forest hover:border-forest/40 transition-colors">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-semibold text-forest w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 rounded-full border border-sage-pale flex items-center justify-center text-forest/60 hover:text-forest hover:border-forest/40 transition-colors">
                          <Plus className="w-3 h-3" />
                        </button>
                        <button onClick={() => removeItem(item.id)} className="ml-auto text-xs text-forest/30 hover:text-red-400 transition-colors">
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="shrink-0 p-4 border-t border-sage-light/30 space-y-3 bg-white">
              {items.length > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-forest/60">
                    {hasAllPrices ? "Subtotal" : pricedItems.length > 0 ? "Partial subtotal" : "Subtotal"}
                  </span>
                  {hasAllPrices || pricedItems.length > 0 ? (
                    <span className="font-bold text-forest">
                      ${subtotal.toFixed(2)}
                      {!hasAllPrices && <span className="text-xs text-forest/40 font-normal ml-1">+others</span>}
                    </span>
                  ) : (
                    <span className="text-xs text-forest/40">See prices on Amazon</span>
                  )}
                </div>
              )}
              <button
                onClick={() => setStep("confirm")}
                disabled={items.length === 0}
                className="w-full bg-forest text-white py-3 rounded-xl font-semibold text-sm hover:bg-forest-light transition-colors flex items-center justify-center gap-2 disabled:opacity-40"
              >
                <ExternalLink className="w-4 h-4" />
                Checkout on Amazon
              </button>
              {items.length > 0 && (
                <button onClick={clearCart} className="w-full text-forest/50 text-xs py-1.5 hover:text-forest/80 transition-colors">
                  Clear cart
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Confirmation view */}
            <div className="flex-1 overflow-y-auto p-5 min-h-0">
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-full bg-green/10 flex items-center justify-center mx-auto mb-3">
                  <ExternalLink className="w-6 h-6 text-green" />
                </div>
                <h3 className="font-serif text-lg font-bold text-forest mb-1">Ready to shop on Amazon?</h3>
                <p className="text-sm text-forest/55 leading-snug">
                  {session?.user
                    ? "This list will be saved to your account so you can buy it again in one click."
                    : "Sign in to save your shopping lists for easy reordering."}
                </p>
              </div>

              {/* Order summary */}
              <div className="space-y-2 mb-4">
                <p className="text-xs font-semibold text-forest/40 uppercase tracking-wide">Your list</p>
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 py-2 border-b border-sage-pale/50 last:border-0">
                    <div className="w-10 h-10 rounded-md overflow-hidden shrink-0 bg-sage-pale">
                      <CartImage src={item.imageUrl} alt={item.name} />
                    </div>
                    <p className="flex-1 text-xs text-forest line-clamp-2">{item.name}</p>
                    <div className="shrink-0 text-right">
                      {item.price != null ? (
                        <span className="text-xs font-semibold text-forest">${(item.price * item.quantity).toFixed(2)}</span>
                      ) : (
                        <span className="text-xs text-forest/40">×{item.quantity}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Subtotal row on confirm screen */}
              <div className="flex items-center justify-between text-sm pt-2">
                <span className="text-forest/60">{hasAllPrices ? "Subtotal" : "Estimated subtotal"}</span>
                {pricedItems.length > 0 ? (
                  <span className="font-bold text-forest">
                    ${subtotal.toFixed(2)}
                    {!hasAllPrices && <span className="text-xs text-forest/40 font-normal ml-1">+others</span>}
                  </span>
                ) : (
                  <span className="text-xs text-forest/40">See prices on Amazon</span>
                )}
              </div>

              {noAsinItems.length > 0 && (
                <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 rounded-xl p-3 mt-2">
                  <ExternalLink className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>
                    {noAsinItems.length === items.length
                      ? "These items will open as Amazon searches — no direct cart link available yet."
                      : `${noAsinItems.length} item${noAsinItems.length > 1 ? "s" : ""} will open as Amazon searches instead of going straight to your cart.`}
                  </span>
                </div>
              )}

              {session?.user && (
                <div className="flex items-start gap-2 text-xs text-forest/50 bg-sage-pale rounded-xl p-3">
                  <CheckCircle className="w-3.5 h-3.5 text-green mt-0.5 shrink-0" />
                  <span>This list will be saved to <strong className="text-forest">Past Shopping Lists</strong> in your account.</span>
                </div>
              )}
            </div>

            {/* Confirm footer */}
            <div className="shrink-0 p-4 border-t border-sage-light/30 space-y-2 bg-white">
              <button
                onClick={handleConfirmCheckout}
                disabled={loading}
                className="w-full bg-forest text-white py-3 rounded-xl font-semibold text-sm hover:bg-forest-light transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ExternalLink className="w-4 h-4" />}
                {loading ? "Opening Amazon…" : "Confirm & Open Amazon"}
              </button>
              <button onClick={() => setStep("cart")} className="w-full text-forest/50 text-xs py-1.5 hover:text-forest/80 transition-colors">
                ← Go back to cart
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
