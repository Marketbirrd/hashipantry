import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const search = searchParams.get("search")?.toLowerCase() ?? "";
  const category = searchParams.get("category") ?? "All";
  const diet = searchParams.getAll("diet");
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = 24;

  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { excerpt: { contains: search, mode: "insensitive" } },
    ];
  }

  if (category !== "All") {
    where.category = category;
  }

  if (diet.length > 0) {
    where.dietTags = { hasEvery: diet };
  }

  const [recipes, total] = await Promise.all([
    prisma.recipe.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        imageUrl: true,
        prepTime: true,
        servings: true,
        difficulty: true,
        excerpt: true,
        category: true,
        dietTags: true,
      },
    }),
    prisma.recipe.count({ where }),
  ]);

  return NextResponse.json({ recipes, total, page, pages: Math.ceil(total / limit) });
}
