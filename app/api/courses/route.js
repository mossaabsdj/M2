import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ GET ALL COURSES
export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      include: {
        niveau: true,
        chapters: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(courses);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch courses", details: error.message },
      { status: 500 },
    );
  }
}

// ✅ CREATE COURSE
export async function POST(req) {
  try {
    const body = await req.json();
    const { title, niveauId, videoUrl, resumeUrl } = body;

    if (!title || !niveauId) {
      return NextResponse.json(
        { error: "Title and niveauId are required" },
        { status: 400 },
      );
    }

    // Check if niveau exists
    const niveauExists = await prisma.niveau.findUnique({
      where: { id: Number(niveauId) },
    });

    if (!niveauExists) {
      return NextResponse.json({ error: "Niveau not found" }, { status: 404 });
    }

    const course = await prisma.course.create({
      data: {
        title,
        niveauId: Number(niveauId),
        videoUrl,
        resumeUrl,
      },
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create course", details: error.message },
      { status: 500 },
    );
  }
}
