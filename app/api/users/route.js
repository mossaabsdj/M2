import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

// ✅ Get all users (include niveau)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Missing user email", code: "MISSING_EMAIL" },
        { status: 400 },
      );
    }

    const currentUser = await prisma.compte.findUnique({
      where: { email },
      select: { email: true, role: true },
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: "User not found", email },
        { status: 404 },
      );
    }

    const filters = { email: { not: email } };
    if (currentUser.role !== "ADMIN") filters.role = "CLIENT";

    const users = await prisma.compte.findMany({
      where: filters,
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        country: true,
        role: true,
        createdAt: true,
        niveau: { select: { id: true, label: true, code: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("GET /api/users error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users", details: error.message },
      { status: 500 },
    );
  }
}

// ✅ Create new user (with optional niveau)
export async function POST(req) {
  try {
    const body = await req.json();
    const { fullName, email, phone, country, role, password, niveauId } = body;

    if (!email || !password || !fullName) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          missing: { fullName, email, password },
        },
        { status: 400 },
      );
    }

    const existingUser = await prisma.compte.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered", email },
        { status: 400 },
      );
    }

    if (niveauId) {
      const niveauExists = await prisma.niveau.findUnique({
        where: { id: Number(niveauId) },
      });
      if (!niveauExists) {
        return NextResponse.json(
          { error: "Niveau not found", niveauId },
          { status: 404 },
        );
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.compte.create({
      data: {
        fullName,
        email,
        phone,
        country,
        role,
        Password: hashedPassword,
        niveauId: niveauId ? Number(niveauId) : null,
      },
      include: { niveau: { select: { id: true, label: true, code: true } } },
    });

    return NextResponse.json(newUser);
  } catch (error) {
    console.error("POST /api/users error:", error);
    return NextResponse.json(
      { error: "Failed to create user", details: error.message },
      { status: 500 },
    );
  }
}

// ✅ Update user by ID (including niveau)
export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, fullName, email, phone, country, role, password, niveauId } =
      body;

    if (!id) {
      return NextResponse.json(
        { error: "Missing user ID", body },
        { status: 400 },
      );
    }

    const existing = await prisma.compte.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "User not found", id },
        { status: 404 },
      );
    }

    if (niveauId) {
      const niveauExists = await prisma.niveau.findUnique({
        where: { id: Number(niveauId) },
      });
      if (!niveauExists) {
        return NextResponse.json(
          { error: "Niveau not found", niveauId },
          { status: 404 },
        );
      }
    }

    const dataToUpdate = { fullName, email, phone, country, role };
    if (password) dataToUpdate.Password = await bcrypt.hash(password, 10);
    if (niveauId !== undefined) dataToUpdate.niveauId = Number(niveauId);

    const updatedUser = await prisma.compte.update({
      where: { id },
      data: dataToUpdate,
      include: { niveau: { select: { id: true, label: true, code: true } } },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("PUT /api/users error:", error);
    return NextResponse.json(
      { error: "Failed to update user", details: error.message },
      { status: 500 },
    );
  }
}

// ✅ Delete user by ID
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = parseInt(searchParams.get("id"));

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    await prisma.compte.delete({ where: { id } });
    return NextResponse.json({ message: "User deleted", id });
  } catch (error) {
    console.error("DELETE /api/users error:", error);
    return NextResponse.json(
      { error: "Failed to delete user", details: error.message },
      { status: 500 },
    );
  }
}
