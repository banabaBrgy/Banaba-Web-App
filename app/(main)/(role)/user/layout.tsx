import React, { ReactNode } from "react";
import { Sidebar } from "./_components/sidebar";
import { getUser } from "@/lib/user";
import { Navbar } from "./_components/navbar";

export default async function ResidentLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getUser();

  return (
    <div className="min-h-[100dvh] bg-gray-100">
      <Navbar user={user} />
      <Sidebar user={user} />
      <div className="lg:ml-[16rem]">{children}</div>
    </div>
  );
}
