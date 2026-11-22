import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const TOPICS = ["story", "question", "win", "recipe", "product"];
const MAX_LEN = 2000;

function shape(p: { id: string; topic: string; body: string; createdAt: Date; userId: string; user: { name: string | null; image: string | null } }, me?: string) {
  return {
    id: p.id,
    topic: p.topic,
    body: p.body,
    createdAt: p.createdAt,
    author: { name: p.user.name?.split(" ")[0] || "Member", image: p.user.image },
    mine: !!me && p.userId === me,
  };
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const topic = req.nextUrl.searchParams.get("topic");
  const posts = await prisma.communityPost.findMany({
    where: topic && TOPICS.includes(topic) ? { topic } : undefined,
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { user: { select: { name: true, image: true } } },
  });
  return NextResponse.json({ posts: posts.map((p) => shape(p, session?.user?.id)) });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Please sign in to post." }, { status: 401 });

  const { body, topic } = await req.json();
  const text = typeof body === "string" ? body.trim() : "";
  if (!text) return NextResponse.json({ error: "Write something first." }, { status: 400 });
  if (text.length > MAX_LEN) return NextResponse.json({ error: `Posts can be up to ${MAX_LEN} characters.` }, { status: 400 });

  // Light spam guard: one post per 30 seconds per member.
  const recent = await prisma.communityPost.findFirst({
    where: { userId: session.user.id, createdAt: { gt: new Date(Date.now() - 30_000) } },
  });
  if (recent) return NextResponse.json({ error: "You just posted — give it a few seconds." }, { status: 429 });

  const post = await prisma.communityPost.create({
    data: { userId: session.user.id, body: text, topic: TOPICS.includes(topic) ? topic : "story" },
    include: { user: { select: { name: true, image: true } } },
  });
  return NextResponse.json({ post: shape(post, session.user.id) });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await prisma.communityPost.deleteMany({ where: { id, userId: session.user.id } });
  return NextResponse.json({ ok: true });
}
