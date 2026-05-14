import { Download, FileText, BookOpen, Lock } from "lucide-react";

const FREE_RESOURCES = [
  { title: "AIP Pantry Starter List", desc: "A printable list of 50 AIP-approved pantry staples to get you started immediately.", icon: FileText },
  { title: "Hashimoto's Food Avoid List", desc: "Know exactly what to avoid and why. Evidence-based and easy to print.", icon: FileText },
  { title: "Beginner's Guide to AIP", desc: "Everything you need to know about the Autoimmune Protocol in plain language.", icon: BookOpen },
];

const PAID_PRODUCTS = [
  {
    id: "recipe-book",
    title: "The HashiPantry Recipe Book",
    desc: "80+ tested, thyroid-friendly recipes for breakfast, lunch, dinner, snacks, and desserts. Every recipe is AIP, gluten-free, and dairy-free.",
    price: 1997,
    badge: "Most Popular",
    features: ["80+ recipes", "AIP & Paleo", "Printable PDF", "Shopping lists included"],
  },
  {
    id: "meal-plan",
    title: "4-Week Hashimoto's Meal Plan",
    desc: "A complete 4-week meal plan with shopping lists, prep guides, and batch cooking instructions. Takes the guesswork out of eating well.",
    price: 1497,
    badge: null,
    features: ["28-day plan", "Weekly shopping lists", "Batch cooking guide", "Printable PDF"],
  },
  {
    id: "symptom-tracker",
    title: "Symptom & Food Journal",
    desc: "Track your symptoms, food reactions, energy levels, and lab values over time. Identify your personal triggers with this structured worksheet.",
    price: 797,
    badge: "New",
    features: ["90-day journal", "Food reaction tracker", "Lab value log", "Printable PDF"],
  },
];

export default function ResourcesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
      <div className="text-center mb-12">
        <h1 className="font-serif text-4xl font-bold text-forest">Resources &amp; Downloads</h1>
        <p className="mt-3 text-forest/60 max-w-xl mx-auto text-sm leading-relaxed">
          Practical tools to support your Hashimoto&apos;s journey — from free guides to
          comprehensive recipe books and trackers.
        </p>
      </div>

      {/* Free resources */}
      <section className="mb-14">
        <div className="flex items-center gap-2 mb-5">
          <h2 className="font-serif text-2xl font-bold text-forest">Free Resources</h2>
          <span className="text-xs bg-green/10 text-green px-2 py-0.5 rounded-full font-medium">Free</span>
        </div>
        <p className="text-sm text-forest/60 mb-6">
          Sign up for our newsletter to get instant access to all free downloads.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {FREE_RESOURCES.map(({ title, desc, icon: Icon }) => (
            <div
              key={title}
              className="bg-white border border-sage-pale rounded-2xl p-5 hover:shadow-md transition-shadow"
            >
              <Icon className="w-8 h-8 text-green mb-3" />
              <h3 className="font-semibold text-forest text-sm mb-2">{title}</h3>
              <p className="text-xs text-forest/50 leading-relaxed mb-4">{desc}</p>
              <button className="w-full flex items-center justify-center gap-2 border border-forest text-forest text-xs font-semibold py-2.5 rounded-xl hover:bg-forest hover:text-white transition-colors">
                <Download className="w-3.5 h-3.5" /> Get Free Download
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Paid products */}
      <section>
        <h2 className="font-serif text-2xl font-bold text-forest mb-2">Premium Resources</h2>
        <p className="text-sm text-forest/60 mb-6">
          In-depth tools to accelerate your healing journey. Instant download after purchase.
        </p>
        <div className="space-y-4">
          {PAID_PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-sage-pale rounded-2xl p-6 flex flex-col sm:flex-row gap-6"
            >
              <div className="flex-1">
                <div className="flex items-start gap-2 mb-2">
                  <h3 className="font-serif text-lg font-bold text-forest">{product.title}</h3>
                  {product.badge && (
                    <span className="shrink-0 text-[10px] bg-forest text-white px-2 py-0.5 rounded-full font-medium mt-0.5">
                      {product.badge}
                    </span>
                  )}
                </div>
                <p className="text-sm text-forest/60 leading-relaxed mb-3">{product.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {product.features.map((f) => (
                    <span key={f} className="text-xs bg-sage-pale text-forest/70 px-2 py-0.5 rounded-full">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-center justify-center gap-3 shrink-0">
                <p className="font-serif text-2xl font-bold text-forest">
                  ${(product.price / 100).toFixed(2)}
                </p>
                <button className="flex items-center gap-2 bg-forest text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-forest-light transition-colors">
                  <Lock className="w-4 h-4" /> Buy Now
                </button>
                <p className="text-xs text-forest/40">Instant PDF download</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
