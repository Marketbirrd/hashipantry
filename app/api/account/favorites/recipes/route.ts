import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const favs = await prisma.recipeFavorite.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  // Enrich with current recipe details so the Favorites tab can show more than a title.
  const recipes = favs.length
    ? await prisma.recipe.findMany({
        where: { slug: { in: favs.map((f) => f.recipeSlug) } },
        select: { slug: true, prepTime: true, servings: true, difficulty: true, category: true, dietTags: true },
      })
    : [];
  const bySlug = new Map(recipes.map((r) => [r.slug, r]));
  const favorites = favs.map((f) => {
    const r = bySlug.get(f.recipeSlug);
    return {
      ...f,
      prepTime: r?.prepTime ?? null,
      servings: r?.servings ?? null,
      difficulty: r?.difficulty ?? null,
      category: r?.category ?? null,
      dietTags: r?.dietTags ?? [],
    };
  });

  return NextResponse.json({ favorites });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { recipeSlug, recipeTitle, imageUrl } = await req.json();

  const fav = await prisma.recipeFavorite.upsert({
    where: { userId_recipeSlug: { userId: session.user.id, recipeSlug } },
    create: { userId: session.user.id, recipeSlug, recipeTitle, imageUrl },
    update: {},
  });

  return NextResponse.json({ favorite: fav });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const recipeSlug = searchParams.get("recipeSlug");
  if (!recipeSlug) return NextResponse.json({ error: "Missing recipeSlug" }, { status: 400 });

  await prisma.recipeFavorite.deleteMany({
    where: { userId: session.user.id, recipeSlug },
  });

  return NextResponse.json({ ok: true });
}
