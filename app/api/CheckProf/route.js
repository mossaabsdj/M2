import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const { uid } = await req.json();

    if (!uid) {
      return Response.json({ error: "UID is required" }, { status: 400 });
    }

    //  const card = await prisma.card.findUnique({
    //  where: { uid },
    // include: {
    // student: true,
    //},
    //});

    // if (!card) {
    //  return Response.json(null);
    //}

    return new Response("foughalii");
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
