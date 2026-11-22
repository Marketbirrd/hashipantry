import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const score = (v: unknown) => {
  const n = Math.round(Number(v));
  return Number.isFinite(n) ? Math.min(10, Math.max(1, n)) : 5;
};

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

  const body = await req.json();
  let weight: number | null = null;
  if (body.weight !== undefined && body.weight !== null && body.weight !== "") {
    const n = Number(body.weight);
    if (!Number.isFinite(n) || n <= 0 || n > 1500) {
      return NextResponse.json({ error: "Please enter a valid weight" }, { status: 400 });
    }
    weight = Math.round(n * 10) / 10;
  }

  // Always stamp entries with the server's current time so dates are accurate.
  const entry = await prisma.symptomEntry.create({
    data: {
      userId: session.user.id,
      date: new Date(),
      energy: score(body.energy),
      mood: score(body.mood),
      brainFog: score(body.brainFog),
      joint: score(body.joint),
      weight,
      notes: typeof body.notes === "string" && body.notes.trim() ? body.notes.trim().slice(0, 1000) : null,
    },
  });

  // Logging a weight also updates the current weight on the profile.
  if (weight !== null) {
    await prisma.user.update({ where: { id: session.user.id }, data: { weight } });
  }

  return NextResponse.json(entry);
}
