import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import prisma from "@/lib/prisma";

// ✅ GET — Get compte by email
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json(
      { error: "Email query parameter is required" },
      { status: 400 },
    );
  }

  const compte = await prisma.Compte.findUnique({
    where: { email },
  });

  if (!compte) {
    return NextResponse.json({ error: "Compte not found" }, { status: 404 });
  }

  return NextResponse.json({
    fullName: compte.fullName,
    email: compte.email,
    phone: compte.phone,
    country: compte.country,
    role: compte.role,
    createdAt: compte.createdAt,
  });
}

// ✅ PUT — Update compte info
export async function PUT(req) {
  try {
    const { email, newEmail, fullName, phone, country, password } =
      await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required to identify the compte" },
        { status: 400 },
      );
    }

    // ✅ Find the existing compte
    const existing = await prisma.Compte.findUnique({ where: { email } });

    if (!existing) {
      return NextResponse.json({ error: "Compte not found" }, { status: 404 });
    }

    // ✅ Prepare update data
    const dataToUpdate = { fullName, phone, country };

    // 🔐 Hash password if provided
    if (password && password.trim() !== "") {
      dataToUpdate.Password = await bcrypt.hash(password, 10);
    }

    // 📧 Update email if newEmail provided
    if (newEmail && newEmail !== email) {
      const emailExists = await prisma.Compte.findUnique({
        where: { email: newEmail },
      });

      if (emailExists) {
        return NextResponse.json(
          { error: "This email is already in use by another account." },
          { status: 400 },
        );
      }

      dataToUpdate.email = newEmail;
    }

    // ✅ Perform update
    const updatedCompte = await prisma.Compte.update({
      where: { email },
      data: dataToUpdate,
    });

    return NextResponse.json({
      message: "Compte updated successfully",
      compte: {
        fullName: updatedCompte.fullName,
        email: updatedCompte.email,
        phone: updatedCompte.phone,
        country: updatedCompte.country,
        role: updatedCompte.role,
      },
    });
  } catch (error) {
    console.error("Error updating compte:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
