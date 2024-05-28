import { Navbar } from "@/components/navbar";
import React, { ReactNode } from "react";
import { Sidebar } from "./_components/sidebar";
import { getUser } from "@/lib/user";

export default async function Layout({ children }: { children: ReactNode }) {
  const user = await getUser();

  return (
    <div className="min-h-[100dvh] bg-gray-50">
      <Navbar />
      <Sidebar user={user} />
      <div className="lg:ml-[16rem]">{children}</div>
    </div>
  );
}
