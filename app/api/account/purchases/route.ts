import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type PurchaseItem = {
  id: string;
  name: string;
  imageUrl: string;
  affiliateUrl: string;
  quantity: number;
};

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const purchases = await prisma.purchase.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return NextResponse.json({ purchases });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { items } = await req.json() as { items: PurchaseItem[] };
  if (!items?.length) return NextResponse.json({ error: "No items" }, { status: 400 });

  const purchase = await prisma.purchase.create({
    data: {
      userId: session.user.id,
      items,
    },
  });

  return NextResponse.json({ purchase });
}
