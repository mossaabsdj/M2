"use client";
import Image from "next/image";
import Hero from "@/app/component/Home/Hero/page";
import CoursesPage from "./(protected)/Courses/page";
import Header from "@/app/component/Home/Header/page";
import Footer from "./component/Home/Footer/page";
import { useRouter } from "next/navigation"; // at the top
import { useState } from "react";

export default function Home() {
  const route = useRouter();
  const [NavSelected, setSelectedNav] = useState("الرئيسية");
  const Login = () => {};
  return (
    <div>
      <Header
        selectedNav={NavSelected}
        onLogin={() => {
          route.push("/Login");
        }}
        onLogout={() => {}}
        signup={() => {
          route.push("/Registre");
        }}
        setSelectedNav={setSelectedNav}
      />
      {NavSelected === "الرئيسية" && <Hero />}
      {NavSelected === "الدروس" && <CoursesPage />}
      <Footer />
    </div>
  );
}
