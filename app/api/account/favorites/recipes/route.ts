import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const favorites = await prisma.recipeFavorite.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
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
