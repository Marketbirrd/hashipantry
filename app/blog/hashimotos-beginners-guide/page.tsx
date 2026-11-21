import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = { title: "Understanding Your Hashimoto's: A Beginner's Guide | HashiPantry" };

export default function BeginnersGuidePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
      <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-forest/60 hover:text-forest mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Blog
      </Link>

      <div className="mb-6">
        <span className="text-xs font-semibold text-green bg-sage-pale px-2 py-1 rounded-full">FEATURED GUIDE</span>
        <h1 className="font-serif text-4xl font-bold text-forest mt-4 mb-2 leading-tight">
          Understanding Your Hashimoto&apos;s: A Complete Beginner&apos;s Guide
        </h1>
        <p className="text-forest/50 text-sm">15 minute read · Evidence-based</p>
      </div>

      <div className="space-y-8 text-forest/80 leading-relaxed text-sm">

        <p className="text-base text-forest/70 leading-relaxed border-l-4 border-green pl-4">
          If you&apos;ve just been diagnosed with Hashimoto&apos;s thyroiditis — or suspect you have it — you&apos;re probably overwhelmed. This guide breaks down everything you need to know in plain language, so you can start taking control of your health today.
        </p>

        <section>
          <h2 className="font-serif text-2xl font-bold text-forest mb-3">What Is Hashimoto&apos;s Thyroiditis?</h2>
          <p>
            Hashimoto&apos;s thyroiditis (also called Hashimoto&apos;s disease or chronic lymphocytic thyroiditis) is an autoimmune condition in which your immune system mistakenly attacks your thyroid gland. Over time, this damage can reduce the thyroid&apos;s ability to produce hormones, leading to hypothyroidism.
          </p>
          <p className="mt-3">
            It is the most common cause of hypothyroidism in the United States, affecting an estimated 14 million Americans. It is significantly more common in women than men, and can develop at any age — though it most often appears between ages 30 and 50.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold text-forest mb-3">Common Symptoms</h2>
          <p>Symptoms vary widely and can be subtle at first. Common signs include:</p>
          <ul className="mt-3 space-y-2 pl-4">
            {[
              "Fatigue and sluggishness",
              "Increased sensitivity to cold",
              "Constipation",
              "Pale, dry skin",
              "Brittle nails and hair loss",
              "Swelling of the tongue",
              "Unexplained weight gain",
              "Muscle aches and stiffness",
              "Joint pain or stiffness",
              "Depression or brain fog",
              "Slowed heart rate",
              "Irregular or heavy menstrual periods",
            ].map((s) => (
              <li key={s} className="flex items-start gap-2">
                <span className="text-green mt-0.5">•</span> {s}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-forest/60 text-xs italic">
            Note: Many of these symptoms overlap with other conditions. Only a doctor can diagnose Hashimoto&apos;s. See our <Link href="/medical-disclaimer" className="underline">Medical Disclaimer</Link>.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold text-forest mb-3">How Is It Diagnosed?</h2>
          <p>Hashimoto&apos;s is typically diagnosed through:</p>
          <ul className="mt-3 space-y-2 pl-4">
            <li className="flex items-start gap-2"><span className="text-green mt-0.5">•</span> <span><strong>TSH (Thyroid-Stimulating Hormone) test</strong> — elevated TSH suggests the thyroid is underperforming</span></li>
            <li className="flex items-start gap-2"><span className="text-green mt-0.5">•</span> <span><strong>TPO antibodies (Anti-TPO)</strong> — elevated levels confirm autoimmune activity against the thyroid</span></li>
            <li className="flex items-start gap-2"><span className="text-green mt-0.5">•</span> <span><strong>Thyroglobulin antibodies (Anti-Tg)</strong> — another autoimmune marker, sometimes elevated alongside TPO</span></li>
            <li className="flex items-start gap-2"><span className="text-green mt-0.5">•</span> <span><strong>Ultrasound</strong> — can reveal a characteristic heterogeneous texture of the thyroid gland</span></li>
          </ul>
          <p className="mt-3">
            It&apos;s possible to have Hashimoto&apos;s with normal TSH levels. If you suspect Hashimoto&apos;s, ask your doctor to test TPO and Tg antibodies specifically.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold text-forest mb-3">The Role of Diet</h2>
          <p>
            While diet cannot cure Hashimoto&apos;s, many people experience significant improvement in symptoms by reducing foods that trigger inflammation or immune activation.
          </p>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-green/5 border border-green/20 rounded-xl p-4">
              <p className="font-semibold text-forest text-xs uppercase tracking-wide mb-2">Foods Often Avoided</p>
              <ul className="space-y-1">
                {["Gluten (wheat, barley, rye)", "Dairy / casein", "Soy", "Processed sugar", "Seed oils", "Alcohol"].map(f => (
                  <li key={f} className="text-xs text-forest/70 flex gap-1.5"><span className="text-red-400">×</span>{f}</li>
                ))}
              </ul>
            </div>
            <div className="bg-sage-pale border border-sage-light/30 rounded-xl p-4">
              <p className="font-semibold text-forest text-xs uppercase tracking-wide mb-2">Foods Often Embraced</p>
              <ul className="space-y-1">
                {["Leafy greens & vegetables", "Wild-caught fish & seafood", "Pasture-raised poultry & eggs", "Healthy fats (avocado, olive oil)", "Bone broth", "Berries & low-glycemic fruits"].map(f => (
                  <li key={f} className="text-xs text-forest/70 flex gap-1.5"><span className="text-green">✓</span>{f}</li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-4">
            Popular elimination protocols include the <strong>Autoimmune Protocol (AIP)</strong> and <strong>Paleo</strong> diet. Many people start with gluten-free and dairy-free as a first step. Visit our <Link href="/diet-preferences" className="underline text-green">Diet Preferences</Link> page to set filters that match your approach.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold text-forest mb-3">Lifestyle Factors That Matter</h2>
          <ul className="space-y-3">
            {[
              { title: "Sleep", desc: "Prioritize 7–9 hours. Poor sleep worsens inflammation and immune dysregulation." },
              { title: "Stress management", desc: "Chronic stress elevates cortisol, which suppresses thyroid function. Meditation, gentle yoga, and walks in nature all help." },
              { title: "Gentle exercise", desc: "Moderate movement (walking, swimming, Pilates) supports metabolism without overtaxing the adrenals. Avoid intense exercise if you're in a flare." },
              { title: "Toxin reduction", desc: "Consider reducing exposure to plastics (BPA), fluoride, and chemical cleaning products, which may disrupt thyroid function." },
            ].map(({ title, desc }) => (
              <li key={title} className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-sage-pale flex items-center justify-center text-green text-xs font-bold mt-0.5">✓</span>
                <span><strong className="text-forest">{title}:</strong> {desc}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold text-forest mb-3">Your Next Steps</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Shop", desc: "Browse 9,000+ Hashimoto's-friendly products", href: "/shop", cta: "Start shopping" },
              { label: "Recipes", desc: "Find delicious AIP and gluten-free recipes", href: "/recipes", cta: "Browse recipes" },
              { label: "Diet guide", desc: "Set your personal dietary preferences", href: "/diet-preferences", cta: "Set preferences" },
            ].map(({ label, desc, href, cta }) => (
              <Link key={label} href={href} className="bg-white border border-sage-pale rounded-xl p-5 hover:shadow-md transition-shadow group block">
                <p className="text-xs font-semibold text-green mb-1">{label}</p>
                <p className="text-sm text-forest mb-3">{desc}</p>
                <span className="text-xs text-green font-semibold group-hover:underline">{cta} →</span>
              </Link>
            ))}
          </div>
        </section>

        <p className="text-xs text-forest/40 pt-4 border-t border-sage-pale">
          This guide is for informational purposes only. See our <Link href="/medical-disclaimer" className="underline">Medical Disclaimer</Link>. Always consult your healthcare provider before making health decisions.
        </p>
      </div>
    </div>
  );
}
