import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const symptoms = await prisma.symptomEntry.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "desc" },
    take: 30,
  });
  return NextResponse.json({ symptoms });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { energy, mood, brainFog, joint, notes } = await req.json();
  const entry = await prisma.symptomEntry.create({
    data: { userId: session.user.id, energy, mood, brainFog, joint, notes },
  });
  return NextResponse.json(entry);
}
