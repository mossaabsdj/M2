import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ GET ONE SERIES
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const parsedId = parseInt(id);

    const serie = await prisma.series.findUnique({
      where: { id: parsedId },
      include: {
        chapter: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!serie) {
      return NextResponse.json({ error: "Series not found" }, { status: 404 });
    }

    return NextResponse.json(serie);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch series", details: error.message },
      { status: 500 },
    );
  }
}

// ✅ UPDATE SERIES
export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const parsedId = parseInt(id);
    const body = await req.json();
    const { label, serieUrl, solutionUrl, videoUrl, chapterId } = body;

    const updated = await prisma.series.update({
      where: { id: parsedId },
      data: {
        label,
        serieUrl,
        solutionUrl,
        videoUrl,
        chapterId: chapterId ? Number(chapterId) : undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update series", details: error.message },
      { status: 500 },
    );
  }
}

// ✅ DELETE SERIES
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const parsedId = parseInt(id);

    await prisma.series.delete({
      where: { id: parsedId },
    });

    return NextResponse.json({ message: "Series deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete series", details: error.message },
      { status: 500 },
    );
  }
}
