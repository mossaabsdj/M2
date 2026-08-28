import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    // ── 1. Token ─────────────────────────────────────────────────────
    const token = req.headers.get("x-device-token");
    console.log(token);
    if (!token || token !== "shewr1224") {
      return Response.json(
        {
          status: 401,
          code: "INVALID_TOKEN",
          description: "Token invalide ou manquant",
        },
        { status: 401 },
      );
    }

    // ── 2. Body ───────────────────────────────────────────────────────
    const { uid, Session_ID } = await req.json();
    console.log(uid + "+" + Session_ID + "+" + token);

    // ── 3. UID ────────────────────────────────────────────────────────
    if (!uid) {
      return Response.json(
        { status: 400, code: "MISSING_UID", description: "UID est requis" },
        { status: 400 },
      );
    }

    // ── 4. Session ID ─────────────────────────────────────────────────
    if (!Session_ID) {
      return Response.json(
        {
          status: 400,
          code: "MISSING_SESSION_ID",
          description: "Session ID est requis",
        },
        { status: 400 },
      );
    }

    // ── 5. Student check ──────────────────────────────────────────────
    if (uid === "STUDENT_UID_HERE") {
      return Response.json(
        {
          status: 200,
          code: "ATTENDANCE_MARKED",
          description: "Présence enregistrée avec succès",
          session_id: Session_ID,
          uid,
        },
        { status: 200 },
      );
    } else {
      return Response.json(
        {
          status: 404,
          code: "STUDENT_NOT_FOUND",
          description: "Étudiant non reconnu",
        },
        { status: 404 },
      );
    }
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        status: 500,
        code: "SERVER_ERROR",
        description: "Une erreur serveur inattendue s'est produite",
      },
      { status: 500 },
    );
  }
}
