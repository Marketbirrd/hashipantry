import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const SELECT = { name: true, email: true, image: true, weight: true, weightUnit: true, createdAt: true } as const;

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: SELECT });
  return NextResponse.json(user);
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, image, weight, weightUnit } = await req.json();

  let weightValue: number | null | undefined = undefined;
  if (weight !== undefined) {
    if (weight === null || weight === "") weightValue = null;
    else {
      const n = Number(weight);
      if (!Number.isFinite(n) || n <= 0 || n > 1500) {
        return NextResponse.json({ error: "Please enter a valid weight" }, { status: 400 });
      }
      weightValue = Math.round(n * 10) / 10;
    }
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      ...(name !== undefined && { name: String(name).trim() || null }),
      ...(image !== undefined && { image: String(image).trim() || null }),
      ...(weightValue !== undefined && { weight: weightValue }),
      ...((weightUnit === "lb" || weightUnit === "kg") && { weightUnit }),
    },
    select: SELECT,
  });

  return NextResponse.json(user);
}
