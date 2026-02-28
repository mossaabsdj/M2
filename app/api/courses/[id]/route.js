import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ GET ONE COURSE
export async function GET(req, { params }) {
  try {
    const id = parseInt(params.id);

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        niveau: true,
        chapters: {
          include: {
            series: true,
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch course", details: error.message },
      { status: 500 },
    );
  }
}

// ✅ UPDATE COURSE
export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const parsedId = parseInt(id);
    const body = await req.json();
    const { title, niveauId, videoUrl, resumeUrl } = body;

    const updated = await prisma.course.update({
      where: { id: parsedId },
      data: {
        title,
        niveauId: niveauId ? Number(niveauId) : undefined,
        videoUrl,
        resumeUrl,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update course", details: error.message },
      { status: 500 },
    );
  }
}

// ✅ DELETE COURSE
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const parsedId = parseInt(id);

    await prisma.course.delete({
      where: { id: parsedId },
    });

    return NextResponse.json({ message: "Course deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete course", details: error.message },
      { status: 500 },
    );
  }
}
