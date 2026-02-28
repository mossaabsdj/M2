import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ GET ONE
export async function GET(req, { params }) {
  try {
    const id = parseInt(params.id);

    const niveau = await prisma.niveau.findUnique({
      where: { id },
      include: {
        courses: {
          include: {
            chapters: true,
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
      { error: "Failed to fetch niveau", details: error.message },
      { status: 500 },
    );
  }
}

// ✅ UPDATE

export async function PUT(req, context) {
  try {
    const { id } = await context.params;
    const parsedId = parseInt(id);
    console.log(parsedId);
    if (!parsedId) {
      return NextResponse.json(
        { error: "Invalid id", details: "Missing or invalid id" },
        { status: 400 },
      );
    }

    const body = await req.json();
    const { code, label } = body;

    const updated = await prisma.niveau.update({
      where: { id: parsedId },
      data: {
        code,
        label,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update niveau", details: error.message },
      { status: 500 },
    );
  }
}

// ✅ DELETE
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const parsedId = parseInt(id);

    await prisma.niveau.delete({
      where: { id: parsedId },
    });

    return NextResponse.json({ message: "Niveau deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete niveau", details: error.message },
      { status: 500 },
    );
  }
}
