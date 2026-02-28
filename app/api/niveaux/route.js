import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ GET ALL NIVEAUX
export async function GET() {
  try {
    const niveaux = await prisma.niveau.findMany({
      include: {
        courses: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(niveaux);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch niveaux", details: error.message },
      { status: 500 },
    );
  }
}

// ✅ CREATE NIVEAU
export async function POST(req) {
  try {
    const body = await req.json();
    const { code, label } = body;

    if (!code || !label) {
      return NextResponse.json(
        { error: "Code and label are required" },
        { status: 400 },
      );
    }

    const niveau = await prisma.niveau.create({
      data: {
        code,
        label,
      },
    });

    return NextResponse.json(niveau, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create niveau", details: error.message },
      { status: 500 },
    );
  }
}
