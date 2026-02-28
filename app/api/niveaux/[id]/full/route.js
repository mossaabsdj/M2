import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const parsedid = Number(id);

    if (!parsedid) {
      return NextResponse.json(
        { error: "Niveau ID is required" },
        { status: 400 },
      );
    }

    const niveau = await prisma.niveau.findUnique({
      where: { id: parsedid },
      include: {
        courses: {
          include: {
            chapters: {
              include: {
                series: true,
              },
            },
          },
        },
      },
    });

    if (!niveau) {
      return NextResponse.json({ error: "Niveau not found" }, { status: 404 });
    }

    return NextResponse.json(niveau);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch full niveau", details: error.message },
      { status: 500 },
    );
  }
}
