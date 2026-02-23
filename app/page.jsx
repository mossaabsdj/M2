"use client";
import Image from "next/image";
import Hero from "@/app/component/Home/Hero/page";
import Header from "@/app/component/Home/Header/page";
import Footer from "./component/Home/Footer/page";
import { useRouter } from "next/navigation"; // at the top

export default function Home() {
  const route = useRouter();

  const Login = () => {};
  return (
    <div>
      <Header
        onLogin={() => {
          route.push("/Login");
        }}
        onLogout={() => {}}
      />
      <Hero />
      <Footer />
    </div>
  );
}
