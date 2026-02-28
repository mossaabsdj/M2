import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ GET ALL CHAPTERS
export async function GET() {
  try {
    const chapters = await prisma.chapter.findMany({
      include: {
        course: true,
        series: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(chapters);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch chapters", details: error.message },
      { status: 500 },
    );
  }
}

// ✅ CREATE CHAPTER
export async function POST(req) {
  try {
    const body = await req.json();
    const { title, videoUrl, resumeUrl, courseId } = body;

    if (!title || !courseId) {
      return NextResponse.json(
        { error: "Title and courseId are required" },
        { status: 400 },
      );
    }

    // Check if course exists
    const courseExists = await prisma.course.findUnique({
      where: { id: Number(courseId) },
    });

    if (!courseExists) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const chapter = await prisma.chapter.create({
      data: {
        title,
        videoUrl,
        resumeUrl,
        courseId: Number(courseId),
      },
    });

    return NextResponse.json(chapter, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create chapter", details: error.message },
      { status: 500 },
    );
  }
}
