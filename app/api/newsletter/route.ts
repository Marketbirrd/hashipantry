import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const email = formData.get("email") as string;

    if (!email || !email.includes("@")) {
      return NextResponse.redirect(new URL("/?newsletter=invalid", req.url));
    }

    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: {},
      create: { email },
    });

    return NextResponse.redirect(new URL("/?newsletter=success", req.url));
  } catch {
    return NextResponse.redirect(new URL("/?newsletter=error", req.url));
  }
}
