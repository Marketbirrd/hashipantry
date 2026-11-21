import Link from "next/link";

export const metadata = { title: "Medical Disclaimer | HashiPantry" };

export default function MedicalDisclaimerPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
      <h1 className="font-serif text-4xl font-bold text-forest mb-2">Medical Disclaimer</h1>
      <p className="text-forest/50 text-sm mb-10">Please read before using this site</p>

      <div className="space-y-6 text-forest/80 leading-relaxed text-sm">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-amber-900 font-medium">
          <strong>Important:</strong> The information on HashiPantry is for educational and informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment.
        </div>

        <section>
          <h2 className="font-serif text-xl font-bold text-forest mb-2">Not Medical Advice</h2>
          <p>
            Nothing on this website — including product recommendations, recipes, blog articles, diet guides, or any other content — constitutes medical advice. HashiPantry is a general wellness and product discovery resource for people interested in Hashimoto&apos;s-friendly living.
          </p>
          <p className="mt-3">
            Always consult a qualified healthcare provider before making changes to your diet, supplement regimen, or treatment plan, especially if you have been diagnosed with Hashimoto&apos;s thyroiditis or any other medical condition.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-forest mb-2">No Doctor-Patient Relationship</h2>
          <p>
            Use of this website does not create a doctor-patient or any other professional relationship between you and HashiPantry, its owners, or any contributors. The content is provided on an &quot;as is&quot; basis.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-forest mb-2">Individual Results Vary</h2>
          <p>
            Hashimoto&apos;s thyroiditis affects everyone differently. A product, food, or lifestyle approach that works for one person may not work for another. Product and recipe recommendations on this site are based on general research about Hashimoto&apos;s-friendly ingredients — they are not personalized medical recommendations.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-forest mb-2">Supplements & Products</h2>
          <p>
            Supplements and health products featured on this site have not been evaluated by the Food and Drug Administration (FDA) unless specifically noted. These products are not intended to diagnose, treat, cure, or prevent any disease.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-forest mb-2">Emergency Situations</h2>
          <p>
            If you are experiencing a medical emergency, call 911 or your local emergency number immediately. Do not rely on this website for emergency medical guidance.
          </p>
        </section>

        <p className="text-xs text-forest/40 pt-4 border-t border-sage-pale">
          Last updated: November 2026 · Questions? <Link href="/contact" className="underline hover:text-forest">Contact us</Link>
        </p>
      </div>
    </div>
  );
}
