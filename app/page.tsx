import Link from "next/link";
import { ArrowRight, ShieldCheck, BookOpen, Users } from "lucide-react";
import DietPreferencesWidget from "@/components/DietPreferencesWidget";
import FeaturedRecipes from "@/components/FeaturedRecipes";
import KnowledgeHub from "@/components/KnowledgeHub";
import ProductCard from "@/components/ProductCard";
import { FEATURED_PRODUCTS } from "@/lib/products-data";

const features = [
  {
    icon: ShieldCheck,
    title: "Shop Hundreds of Products",
    description:
      "Every single item is 100% vetted and guaranteed Hashimoto's-friendly.",
  },
  {
    icon: Users,
    title: "The Hashi Guarantee",
    description:
      "We read every label so you never have to. Strict ingredient vetting process.",
  },
  {
    icon: BookOpen,
    title: "Healing Recipes",
    description:
      "Delicious, easy-to-make recipes that use amazing, thyroid-friendly products.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[520px] flex items-center justify-center overflow-hidden bg-forest">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/hashibackground.jpg')" }}
        />
        <div className="absolute inset-0 bg-forest/55" />
        <div className="relative z-10 text-center px-4 py-20 max-w-3xl mx-auto">
          <h1 className="font-serif text-5xl sm:text-6xl font-bold text-white leading-tight tracking-wide uppercase">
            Finally.
            <br />
            <span className="text-sage-light">A Pantry You Can Trust.</span>
          </h1>
          <p className="mt-6 text-white/80 text-lg max-w-xl mx-auto leading-relaxed">
            We&apos;ve done the work so you don&apos;t have to. Shop hundreds of
            delicious, strictly approved staples, snacks, and ingredients, all
            in one place.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Link
              href="/shop"
              className="px-6 py-3 bg-green text-white font-semibold rounded-xl hover:bg-green-light transition-colors shadow-lg"
            >
              Start Shopping
            </Link>
            <Link
              href="/recipes"
              className="px-6 py-3 border-2 border-white/60 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
            >
              Explore Recipes
            </Link>
          </div>
        </div>
      </section>

      {/* Feature pillars */}
      <section className="bg-forest py-12">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
                <Icon className="w-6 h-6 text-sage-light" />
              </div>
              <h3 className="font-serif font-semibold text-white text-base">
                {title}
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Diet Preferences */}
      <section className="bg-cream py-16 px-4">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h2 className="font-serif text-3xl font-bold text-forest">
            Set Your Diet Preferences
          </h2>
          <p className="mt-2 text-forest/60 text-sm">
            Everyone&apos;s Hashimoto&apos;s journey is different. Select the
            foods you can tolerate to personalize your product and recipe
            recommendations.
          </p>
        </div>
        <DietPreferencesWidget />
      </section>

      {/* Featured Products strip */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-serif text-3xl font-bold text-forest">
                Featured Products
              </h2>
              <p className="text-forest/60 text-sm mt-1">
                Our most-loved Hashimoto&apos;s-friendly pantry staples
              </p>
            </div>
            <Link
              href="/shop"
              className="flex items-center gap-1 text-green font-medium text-sm hover:gap-2 transition-all"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {FEATURED_PRODUCTS.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Recipes */}
      <section className="bg-cream py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl font-bold text-forest">
              Featured Recipes
            </h2>
            <p className="mt-2 text-forest/60 text-sm max-w-lg mx-auto">
              Discover our most popular and{" "}
              <span className="text-green font-medium">delicious</span> recipes,
              carefully curated for every taste and dietary preference.
            </p>
          </div>
          <FeaturedRecipes />
          <div className="text-center mt-8">
            <Link
              href="/recipes"
              className="inline-flex items-center gap-2 border border-forest/30 text-forest px-6 py-2.5 rounded-full text-sm font-medium hover:bg-forest hover:text-white transition-colors"
            >
              View All Recipes
            </Link>
          </div>
        </div>
      </section>

      {/* Knowledge Hub */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl font-bold text-forest">
              The Knowledge Hub: Learn &amp; Thrive with HashiPantry
            </h2>
            <p className="mt-3 text-forest/60 text-sm max-w-2xl mx-auto">
              Knowledge is your power. Explore evidence-based insights, lifestyle
              tips, and empowering resources that explain why our curated
              products are the foundation of feeling your best.
            </p>
          </div>
          <KnowledgeHub />
        </div>
      </section>

      {/* Quick Resources */}
      <section className="bg-cream py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <h3 className="font-serif text-xl font-semibold text-forest mb-4 text-center">
            Quick Resources
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/blog#faq"
              className="bg-white border border-sage-pale rounded-xl p-5 hover:shadow-md transition-shadow group"
            >
              <p className="text-xs text-green font-medium mb-1">FAQ</p>
              <p className="text-sm text-forest font-medium group-hover:text-green transition-colors">
                Common questions
              </p>
            </Link>
            <Link
              href="/community"
              className="bg-white border border-sage-pale rounded-xl p-5 hover:shadow-md transition-shadow group"
            >
              <p className="text-xs text-green font-medium mb-1">Community</p>
              <p className="text-sm text-forest font-medium group-hover:text-green transition-colors">
                Connect with others
              </p>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
