import DietPreferencesWidget from "@/components/DietPreferencesWidget";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function DietPreferencesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
      <div className="text-center mb-10">
        <h1 className="font-serif text-4xl font-bold text-forest">Your Diet Preferences</h1>
        <p className="mt-3 text-forest/60 text-sm max-w-lg mx-auto leading-relaxed">
          Everyone&apos;s Hashimoto&apos;s journey is different. Set your dietary needs once and
          HashiPantry will filter products and recipes to match what works for your body.
        </p>
      </div>

      <DietPreferencesWidget />

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/shop"
          className="flex items-center justify-between bg-white border border-sage-pale rounded-xl p-5 hover:shadow-md transition-shadow group"
        >
          <div>
            <p className="font-semibold text-forest text-sm">Shop Filtered Products</p>
            <p className="text-xs text-forest/50 mt-0.5">See only products that match your diet</p>
          </div>
          <ArrowRight className="w-4 h-4 text-green group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link
          href="/recipes"
          className="flex items-center justify-between bg-white border border-sage-pale rounded-xl p-5 hover:shadow-md transition-shadow group"
        >
          <div>
            <p className="font-semibold text-forest text-sm">Browse Filtered Recipes</p>
            <p className="text-xs text-forest/50 mt-0.5">Recipes that fit your preferences</p>
          </div>
          <ArrowRight className="w-4 h-4 text-green group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Info cards */}
      <div className="mt-10 space-y-4">
        <h2 className="font-serif text-xl font-bold text-forest">Understanding the Protocols</h2>
        {[
          {
            title: "AIP (Autoimmune Protocol)",
            desc: "The most restrictive protocol, AIP eliminates grains, legumes, dairy, eggs, nuts, seeds, nightshades, and processed foods to reduce autoimmune inflammation. It's often used as an elimination diet to identify triggers.",
          },
          {
            title: "Paleo",
            desc: "Focuses on whole, unprocessed foods — meats, fish, fruits, vegetables, nuts, and seeds. Eliminates grains, legumes, dairy, and refined sugars. Less restrictive than AIP but still very beneficial for Hashimoto's.",
          },
          {
            title: "Gluten Free",
            desc: "Eliminating gluten is one of the most important dietary changes for many people with Hashimoto's. Gluten has a molecular structure similar to thyroid tissue, and some research suggests it can trigger antibody attacks.",
          },
          {
            title: "Dairy Free",
            desc: "Many people with Hashimoto's also have casein sensitivity. Dairy can cause inflammation and digestive issues that worsen thyroid symptoms. Many find significant improvement after removing dairy.",
          },
        ].map((item) => (
          <div key={item.title} className="bg-white border border-sage-pale rounded-xl p-5">
            <h3 className="font-semibold text-forest text-sm mb-1">{item.title}</h3>
            <p className="text-xs text-forest/60 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
