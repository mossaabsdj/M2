// app/admin/page.jsx
"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Login from "./Login";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/DashBoard");
  }

  return <Login />;
}
