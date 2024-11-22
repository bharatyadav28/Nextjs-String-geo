"use client";
// import dynamic from "next/dynamic";
import Home from "@/client-pages/Home";
// const Home = dynamic(() => import("@/client-pages/Home"), { ssr: false });

export default function HomePage() {
  return <Home />;
}
