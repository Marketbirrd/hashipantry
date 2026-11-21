import Link from "next/link";

export const metadata = { title: "Commission Disclosure | HashiPantry" };

export default function CommissionDisclosurePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
      <h1 className="font-serif text-4xl font-bold text-forest mb-2">Commission Disclosure</h1>
      <p className="text-forest/50 text-sm mb-10">Affiliate & Compensation Disclosure — Required by the FTC</p>

      <div className="prose prose-sm max-w-none space-y-6 text-forest/80 leading-relaxed">
        <div className="bg-green/10 border border-green/20 rounded-xl p-5 text-sm text-forest font-medium">
          <strong>Short version:</strong> HashiPantry earns a small commission when you purchase products through our Amazon links — at no extra cost to you. This is how we keep the site free.
        </div>

        <section>
          <h2 className="font-serif text-xl font-bold text-forest mb-2">Amazon Associates Program</h2>
          <p>
            HashiPantry (hashipantry.com) is a participant in the <strong>Amazon Services LLC Associates Program</strong>, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to <strong>Amazon.com</strong>.
          </p>
          <p className="mt-3">
            When you click an Amazon link on this site and make a purchase, we may earn an affiliate commission. This comes at <strong>no additional cost to you</strong> — the price you pay on Amazon is exactly the same whether you arrive through our link or directly.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-forest mb-2">How We Choose Products</h2>
          <p>
            All products featured on HashiPantry are selected based on their suitability for people managing Hashimoto&apos;s thyroiditis. Our affiliate relationship with Amazon does <strong>not</strong> influence which products we recommend. We only feature products that meet our strict ingredient and quality standards.
          </p>
          <p className="mt-3">
            We may earn commissions regardless of whether we have a personal relationship with the brand or manufacturer.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-forest mb-2">FTC Compliance</h2>
          <p>
            In accordance with the <strong>Federal Trade Commission&apos;s guidelines</strong> (16 CFR Part 255) concerning the use of endorsements and testimonials in advertising, HashiPantry discloses all material connections between this site and products or services we recommend.
          </p>
          <p className="mt-3">
            Wherever a product link on this site may earn us a commission, we strive to make this clear. The &quot;Shop on Amazon&quot; buttons and product links throughout this site are affiliate links.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-forest mb-2">Your Trust Matters</h2>
          <p>
            Affiliate commissions help us maintain and grow HashiPantry as a free resource for the Hashimoto&apos;s community. We appreciate your support and are committed to recommending only products we genuinely believe in.
          </p>
        </section>

        <p className="text-xs text-forest/40 pt-4 border-t border-sage-pale">
          Last updated: November 2026 · Questions? <Link href="/contact" className="underline hover:text-forest">Contact us</Link>
        </p>
      </div>
    </div>
  );
}
