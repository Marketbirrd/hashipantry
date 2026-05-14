import Link from "next/link";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    tag: "Autoimmune 101",
    title: "Understanding Hashimoto's",
    description:
      "Learn about the autoimmune condition, its causes, symptoms, and how it affects your thyroid function.",
    bullets: [
      "What is Hashimoto's thyroiditis?",
      "Common symptoms and diagnosis",
      "Understanding lab results",
    ],
    href: "/blog?category=autoimmune",
    cta: "Explore articles",
    color: "bg-sage-pale text-forest",
  },
  {
    tag: "Nutrition",
    title: "Nutrition & Diet",
    description:
      "Discover how food can be both medicine and fuel. Learn about therapeutic diets for Hashimoto's management.",
    bullets: [
      "Anti-inflammatory eating patterns",
      "AIP and paleo explained",
      "Foods to avoid and embrace",
    ],
    href: "/blog?category=nutrition",
    cta: "Get started",
    color: "bg-green/10 text-green",
  },
  {
    tag: "Lifestyle",
    title: "Lifestyle & Wellness",
    description:
      "Explore holistic approaches to managing Hashimoto's through stress management, sleep, and gentle movement.",
    bullets: [
      "Stress reduction techniques",
      "Sleep optimization strategies",
      "Safe exercise for thyroid health",
    ],
    href: "/blog?category=lifestyle",
    cta: "See wellness tips",
    color: "bg-amber-50 text-amber-700",
  },
];

export default function KnowledgeHub() {
  return (
    <div className="space-y-6">
      {/* Featured guide */}
      <div className="bg-cream border border-sage-pale rounded-2xl p-6 flex flex-col sm:flex-row gap-6 items-start">
        <div className="flex-1">
          <span className="text-xs font-semibold text-green bg-sage-pale px-2 py-1 rounded-full">
            FEATURED GUIDE
          </span>
          <h3 className="font-serif text-xl font-bold text-forest mt-3 mb-2">
            Understanding Your Hashimoto&apos;s: A Complete Beginner&apos;s Guide
          </h3>
          <p className="text-sm text-forest/70 leading-relaxed mb-3">
            Learn the fundamentals of Hashimoto&apos;s thyroiditis, from symptoms and
            diagnosis to lifestyle changes that help you feel better. This guide covers
            everything you need to know to take control of your health.
          </p>
          <div className="flex gap-2 mb-4">
            {["Beginner-friendly", "15 minute read", "Evidence-based"].map((tag) => (
              <span
                key={tag}
                className="text-xs bg-sage-pale text-forest/70 px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          <Link
            href="/blog/hashimotos-beginners-guide"
            className="inline-flex items-center gap-2 bg-forest text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-forest-light transition-colors"
          >
            Read the guide <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="w-24 h-24 bg-sage-pale rounded-2xl flex items-center justify-center shrink-0">
          <span className="text-3xl">📖</span>
        </div>
      </div>

      {/* Category cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.title}
            className="bg-white border border-sage-pale rounded-xl p-5 hover:shadow-md transition-shadow"
          >
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cat.color}`}
            >
              {cat.tag}
            </span>
            <h4 className="font-serif font-bold text-forest mt-2 mb-1 text-base">
              {cat.title}
            </h4>
            <p className="text-xs text-forest/60 leading-relaxed mb-3">
              {cat.description}
            </p>
            <ul className="space-y-1 mb-4">
              {cat.bullets.map((b) => (
                <li key={b} className="text-xs text-forest/60 flex gap-1.5">
                  <span className="text-green mt-0.5">•</span> {b}
                </li>
              ))}
            </ul>
            <Link
              href={cat.href}
              className="text-xs text-green font-semibold hover:underline"
            >
              {cat.cta} →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
