"use client";
import Image from "next/image";
import Swal from "sweetalert2";

import Hero from "@/app/component/Home/Hero/page";
import CoursesPage from "./(protected)/Courses/Courses";
import Header from "@/app/component/Home/Header/page";
import Footer from "./component/Home/Footer/page";
import { useRouter } from "next/navigation"; // at the top
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

export default function Home() {
  const route = useRouter();
  const { data: session } = useSession();
  const gotoDashboard = () => {
    route.push("/DashBoard");
  };
  const handleLogout = () => {
    Swal.fire({
      title: "هل انت متأكد؟",
      text: "سيتم تسجيل خروجك",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      cancelButtonText: "الفاء",
      confirmButtonText: "نعم,تسجيل الخروج",
    }).then((result) => {
      if (result.isConfirmed) {
        // setIsLoading(true);
        signOut({ callbackUrl: "/" });
      }
    });
  };
  const [NavSelected, setSelectedNav] = useState("الرئيسية");
  const Login = () => {};
  return (
    <div>
      <Header
        selectedNav={NavSelected}
        onLogin={() => {
          route.push("/Login");
        }}
        user={session?.user}
        onLogout={handleLogout}
        signup={() => {
          route.push("/Registre");
        }}
        setSelectedNav={setSelectedNav}
      />
      {NavSelected === "الرئيسية" && <Hero />}
      {NavSelected === "دروسي" && <CoursesPage />}

      {NavSelected === "الإعدادات" ||
        (NavSelected === "لوحة تحكم" && gotoDashboard())}
      <Footer />
    </div>
  );
}
