import { redirect } from "next/navigation";
// استعمل getServerSession إذا كنت تستخدم NextAuth
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";

export default async function AuthLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    const role = session.user.role; // لازم تكون محطوطة في session
    if (role === "ADMIN") redirect("/admin");
    if (role === "PROF") redirect("/prof");
    redirect("/STUDENT");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <div className="w-full max-w-md rounded-2xl border bg-background p-6 shadow">
        {children}
      </div>
    </div>
  );
}
