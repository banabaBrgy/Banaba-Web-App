import { getUser } from "@/lib/user";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getUser();

  if (user?.role === "Admin") {
    redirect("/admin");
  } else if (user?.role === "User") {
    redirect("/resident");
  }

  return (
    <div className="waves-top relative flex items-center justify-center min-h-[100dvh]">
      <Link href="/" title="home">
        <Image
          src="/logo.png"
          alt="Logo"
          width={200}
          height={100}
          priority
          className="absolute left-4 top-3 w-12 h-12 rounded-full"
        />
      </Link>
      {children}
    </div>
  );
}
