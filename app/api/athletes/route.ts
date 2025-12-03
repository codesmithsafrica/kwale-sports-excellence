import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "CLUB") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const club = await prisma.club.findFirst({ where: { ownerId: session.user.id } });
  if (!club) {
    return NextResponse.json({ error: "Club not found" }, { status: 404 });
  }

  const athletes = await prisma.athlete.findMany({
    where: { clubId: club.id },
    include: { metrics: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(athletes);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "CLUB") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const club = await prisma.club.findFirst({ where: { ownerId: session.user.id } });
  if (!club) {
    return NextResponse.json({ error: "Club not found" }, { status: 404 });
  }

  const { name } = await req.json();
  if (!name) {
    return NextResponse.json({ error: "Missing name" }, { status: 400 });
  }

  const athlete = await prisma.athlete.create({
    data: {
      name,
      clubId: club.id,
    },
  });

  return NextResponse.json(athlete);
}
