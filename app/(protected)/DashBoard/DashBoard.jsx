"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

import Header from "@/app/component/admin/navbar/page";
import Footer from "@/app/component/Home/Footer/page";
import ParametrePage from "@/app/component/admin/parametre/page";
import UserManagement from "@/app/component/admin/UserManagment/page";
import CoursesPage from "@/app/component/admin/Courses/page";
export default function Admin() {
  const [currentPage, setCurrentPage] = useState("المستويات والدروس");
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <>
      <Header onNavChange={setCurrentPage} currentPage={currentPage} />

      {currentPage === "الإعدادات" && <ParametrePage />}
      {currentPage === "المستخدمون" && <UserManagement />}
      {currentPage === "المستويات والدروس" && <CoursesPage />}

      <Footer />
    </>
  );
}
