import prisma from "@/lib/prisma";
// --- GET: fetch all feedbacks
export async function GET() {
  try {
    const feedbacks = await prisma.feedback.findMany({
      orderBy: { createdAt: "desc" },
    });
    return Response.json(feedbacks);
  } catch (error) {
    console.error("GET error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch feedbacks" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}

// --- POST: create new feedback
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, rating, comment } = body;

    if (!name || !rating || !comment) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const feedback = await prisma.feedback.create({
      data: { name, rating, comment },
    });

    return Response.json(feedback, { status: 201 });
  } catch (error) {
    console.error("POST error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create feedback" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}

// --- DELETE: delete feedback by id
export async function DELETE(req) {
  try {
    const body = await req.json();
    const id = Number(body.id);

    if (!id) {
      return new Response(JSON.stringify({ error: "Missing ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const deleted = await prisma.feedback.delete({
      where: { id },
    });

    return Response.json({ success: true, feedback: deleted });
  } catch (error) {
    console.error("DELETE error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to delete feedback" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}

// --- PUT: update feedback
export async function PUT(req) {
  try {
    const body = await req.json();
    const id = Number(body.id);

    if (!id) {
      return new Response(JSON.stringify({ error: "Missing ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const updated = await prisma.feedback.update({
      where: { id },
      data: {
        name: body.name || undefined,
        rating: body.rating || undefined,
        comment: body.comment || undefined,
      },
    });

    return Response.json({ success: true, feedback: updated });
  } catch (error) {
    console.error("PUT error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to update feedback" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
