import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const athleteId = searchParams.get("athleteId");

  if (!athleteId) {
    return NextResponse.json({ error: "Missing athleteId" }, { status: 400 });
  }

  const metrics = await prisma.performanceMetric.findMany({
    where: { athleteId },
    orderBy: { date: "asc" },
  });

  return NextResponse.json(metrics);
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

  const { athleteId, metricType, value, date } = await req.json();
  if (!athleteId || !metricType || value === undefined || !date) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const athlete = await prisma.athlete.findFirst({ where: { id: athleteId, clubId: club.id } });
  if (!athlete) {
    return NextResponse.json({ error: "Athlete not found or not in your club" }, { status: 404 });
  }

  const metric = await prisma.performanceMetric.create({
    data: {
      athleteId,
      metricType,
      value,
      date: new Date(date),
    },
  });

  return NextResponse.json(metric);
}
