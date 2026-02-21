"use client";
import Image from "next/image";
import Hero from "@/app/component/Home/Hero/page";
import Header from "@/app/component/Home/Header/page";
import Footer from "./component/Home/Footer/page";
export default function Home() {
  const Login = () => {};
  return (
    <div>
      <Header onLogin={() => {}} onLogout={() => {}} />
      <Hero />
      <Footer />
    </div>
  );
}
