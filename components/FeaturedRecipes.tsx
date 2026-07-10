import Link from "next/link";
import { Clock, Users, ChefHat } from "lucide-react";
import { prisma } from "@/lib/prisma";

function heroImg(url: string): string {
  return url.replace(/-\d+x\d+(\.\w+)$/, "-480x360$1");
}

export default async function FeaturedRecipes() {
  const recipes = await prisma.recipe.findMany({
    orderBy: { publishedAt: "desc" },
    take: 3,
    select: {
      id: true,
      title: true,
      slug: true,
      imageUrl: true,
      prepTime: true,
      servings: true,
      dietTags: true,
    },
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <div
          key={recipe.slug}
          className="bg-white rounded-2xl overflow-hidden border border-sage-pale hover:shadow-lg transition-shadow group"
        >
          <div className="relative aspect-[4/3] bg-sage-pale overflow-hidden">
            {recipe.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={heroImg(recipe.imageUrl)}
                alt={recipe.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ChefHat className="w-10 h-10 text-forest/20" />
              </div>
            )}
            <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
              {recipe.dietTags.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="text-[10px] bg-forest/80 text-white px-1.5 py-0.5 rounded-full font-medium"
                >
                  {t.split(" ").map(w => w[0]).join("")}
                </span>
              ))}
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-forest text-sm leading-snug mb-2 line-clamp-2">
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
