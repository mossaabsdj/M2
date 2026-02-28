import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ GET ALL SERIES
export async function GET() {
  try {
    const series = await prisma.series.findMany({
      include: {
        chapter: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(series);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch series", details: error.message },
      { status: 500 },
    );
  }
}

// ✅ CREATE SERIES
export async function POST(req) {
  try {
    const body = await req.json();
    const { label, serieUrl, solutionUrl, videoUrl, chapterId } = body;

    if (!label || !chapterId) {
      return NextResponse.json(
        { error: "Label and chapterId are required" },
        { status: 400 },
      );
    }

    // Check if chapter exists
    const chapterExists = await prisma.chapter.findUnique({
      where: { id: Number(chapterId) },
    });

    if (!chapterExists) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }

    const newSeries = await prisma.series.create({
      data: {
        label,
        serieUrl,
        solutionUrl,
        videoUrl,
        chapterId: Number(chapterId),
      },
    });

    return NextResponse.json(newSeries, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create series", details: error.message },
      { status: 500 },
    );
  }
}
