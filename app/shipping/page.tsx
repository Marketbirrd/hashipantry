import Link from "next/link";

export const metadata = { title: "Shipping Notice | HashiPantry" };

export default function ShippingPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
      <h1 className="font-serif text-4xl font-bold text-forest mb-2">Shipping Notice</h1>
      <p className="text-forest/50 text-sm mb-10">How orders and shipping work on HashiPantry</p>

      <div className="space-y-6 text-forest/80 leading-relaxed text-sm">
        <div className="bg-green/10 border border-green/20 rounded-xl p-5 text-forest font-medium">
          <strong>HashiPantry does not sell or ship products directly.</strong> All purchases are fulfilled by Amazon or the respective third-party seller through Amazon.com.
        </div>

        <section>
          <h2 className="font-serif text-xl font-bold text-forest mb-2">How Purchasing Works</h2>
          <p>
            When you click &quot;Shop on Amazon&quot; or &quot;Checkout on Amazon,&quot; you are redirected to Amazon.com to complete your purchase. HashiPantry is a product discovery and recommendation platform — we do not handle any transactions, payments, or inventory.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-forest mb-2">Shipping & Delivery</h2>
          <p>
            All shipping, delivery timelines, and fulfillment are handled entirely by Amazon and/or the individual sellers on the Amazon marketplace. Shipping options (including Amazon Prime) are determined at checkout on Amazon based on your location, the seller, and the specific item.
          </p>
          <p className="mt-3">
            HashiPantry has no visibility into or control over shipping times, carriers, or delivery status. For shipping inquiries, please contact Amazon customer service directly.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-forest mb-2">Returns & Refunds</h2>
          <p>
            All return and refund requests must be handled through Amazon according to their return policy. HashiPantry cannot process returns, refunds, or exchanges. Please visit <a href="https://www.amazon.com/returns" target="_blank" rel="noopener noreferrer" className="underline text-green">Amazon Returns</a> for more information.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-forest mb-2">Product Availability & Pricing</h2>
          <p>
            Product availability, pricing, and details shown on HashiPantry may not always reflect current information on Amazon. Prices and availability are set by Amazon and third-party sellers and can change at any time. Always confirm pricing on Amazon before completing your purchase.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-forest mb-2">Questions?</h2>
          <p>
            If you have questions about a specific product recommendation or the HashiPantry platform, feel free to <Link href="/contact" className="underline text-green">contact us</Link>. For order-related questions, please reach out to Amazon customer service.
          </p>
        </section>

        <p className="text-xs text-forest/40 pt-4 border-t border-sage-pale">
          Last updated: November 2026
        </p>
      </div>
    </div>
  );
}
