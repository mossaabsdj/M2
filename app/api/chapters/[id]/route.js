import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ GET ONE CHAPTER
export async function GET(req, { params }) {
  try {
    const id = parseInt(params.id);

    const chapter = await prisma.chapter.findUnique({
      where: { id },
      include: {
        course: true,
        series: true,
      },
    });

    if (!chapter) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }

    return NextResponse.json(chapter);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch chapter", details: error.message },
      { status: 500 },
    );
  }
}

// ✅ UPDATE CHAPTER
export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const parsedId = parseInt(id);
    const body = await req.json();
    const { title, videoUrl, resumeUrl, courseId } = body;

    const updated = await prisma.chapter.update({
      where: { id: parsedId },
      data: {
        title,
        videoUrl,
        resumeUrl,
        courseId: courseId ? Number(courseId) : undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update chapter", details: error.message },
      { status: 500 },
    );
  }
}

// ✅ DELETE CHAPTER
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const parsedId = parseInt(id);

    await prisma.chapter.delete({
      where: { id: parsedId },
    });

    return NextResponse.json({ message: "Chapter deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete chapter", details: error.message },
      { status: 500 },
    );
  }
}
