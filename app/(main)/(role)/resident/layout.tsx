import Navbar from "@/components/navbar";
import React, { ReactNode } from "react";
import Sidebar from "./_components/sidebar";

export default function ResidentLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-gray-100">
      <Navbar />
      <Sidebar />
      <div>{children}</div>
    </div>
  );
}
