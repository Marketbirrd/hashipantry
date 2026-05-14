import Link from "next/link";
import Image from "next/image";
import { Clock, Users } from "lucide-react";

const FEATURED = [
  {
    slug: "sweet-potato-breakfast-hash",
    title: "Sweet Potato Breakfast Hash",
    prepTime: 30,
    servings: 2,
    imageUrl: "/images/recipes/sweet-potato-hash.jpg",
    tags: ["AIP", "GF", "DF"],
  },
  {
    slug: "coconut-cassava-pancakes",
    title: "Coconut Cassava Pancakes",
    prepTime: 20,
    servings: 2,
    imageUrl: "/images/recipes/cassava-pancakes.jpg",
    tags: ["AIP", "GF", "DF", "NF"],
  },
  {
    slug: "blueberry-tigernut-muffins",
    title: "Blueberry Tigernut Muffins",
    prepTime: 25,
    servings: 6,
    imageUrl: "/images/recipes/tigernut-muffins.jpg",
    tags: ["AIP", "GF", "DF"],
  },
];

export default function FeaturedRecipes() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {FEATURED.map((recipe) => (
        <div
          key={recipe.slug}
          className="bg-white rounded-2xl overflow-hidden border border-sage-pale hover:shadow-lg transition-shadow group"
        >
          <div className="relative aspect-[4/3] bg-sage-pale overflow-hidden">
            <Image
              src={recipe.imageUrl}
              alt={recipe.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 33vw"

            />
            <div className="absolute top-2 left-2 flex gap-1">
              {recipe.tags.map((t) => (
                <span
                  key={t}
                  className="text-[10px] bg-forest/80 text-white px-1.5 py-0.5 rounded-full font-medium"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-forest text-sm leading-snug mb-2">
              {recipe.title}
            </h3>
            <div className="flex items-center gap-3 text-xs text-forest/50 mb-3">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> {recipe.prepTime} mins
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" /> Serves {recipe.servings}
              </span>
            </div>
            <Link
              href={`/recipes/${recipe.slug}`}
              className="block w-full text-center bg-forest text-white text-xs font-semibold py-2.5 rounded-lg hover:bg-forest-light transition-colors"
            >
              View Recipe
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
