import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const clubs = await prisma.club.findMany({
    include: { owner: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(clubs);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { clubName, email, password } = await req.json();
  if (!clubName || !email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      name: email,
      password: hashedPassword,
      role: "CLUB",
    },
  });

  const club = await prisma.club.create({
    data: {
      name: clubName,
      ownerId: user.id,
      status: "APPROVED",
    },
  });

  return NextResponse.json({ club, user });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { clubId, status } = await req.json();
  if (!clubId || !status) {
    return NextResponse.json({ error: "Missing clubId or status" }, { status: 400 });
  }

  const club = await prisma.club.update({
    where: { id: clubId },
    data: { status },
  });

  return NextResponse.json(club);
}
