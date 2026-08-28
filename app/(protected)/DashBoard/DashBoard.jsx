"use client";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

import Header from "@/app/component/admin/Header/page";
import Footer from "@/app/component/Home/Footer/page";
import ParametrePage from "@/app/component/admin/parametre/page";
import UserManagement from "@/app/component/admin/UserManagment/page";
import CoursesPage from "@/app/component/admin/Courses/page";
export default function Admin() {
  const [currentPage, setCurrentPage] = useState("الإعدادات");
  const { data: session } = useSession();
  const route = useRouter();
  const gotoHome = () => {
    route.push("/");
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
  return (
    <>
      <Header
        selectedNav={currentPage}
        onLogin={() => {
          route.push("/Login");
        }}
        user={session?.user}
        onLogout={handleLogout}
        signup={() => {
          route.push("/Registre");
        }}
        setSelectedNav={setCurrentPage}
      />
      {currentPage === "الرئيسية" && gotoHome()}
      {currentPage === "الإعدادات" && <ParametrePage />}
      {currentPage === "إدارة المستخدمين" && <UserManagement />}
      {currentPage === "إدارة الدروس" && <CoursesPage />}

      <Footer />
    </>
  );
}
