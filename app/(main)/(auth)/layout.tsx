import { getUser } from "@/lib/user";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getUser();

  switch (user?.role) {
    case "Admin":
      redirect("/admin");
    case "Resident":
      redirect("/resident");
  }

  return (
    <div className="waves-top relative flex items-center justify-center min-h-[100dvh]">
      {children}
    </div>
  );
}
