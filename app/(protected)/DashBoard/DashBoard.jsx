"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

import Header from "@/app/component/admin/navbar/page";
import ProductPage from "@/app/component/admin/products/page";
import ParametrePage from "@/app/component/admin/parametre/page";
export default function Admin() {
  const [currentPage, setCurrentPage] = useState("Paramètre");
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <>
      <Header onNavChange={setCurrentPage} currentPage={currentPage} />

      {currentPage === "Products" && <ProductPage />}
      {currentPage === "Paramètre" && <ParametrePage />}
    </>
  );
}
