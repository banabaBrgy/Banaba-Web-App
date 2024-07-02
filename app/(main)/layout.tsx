import Assistant from "@/components/assistant";
import React, { ReactNode } from "react";

export default async function MainLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div>
      <Assistant />
      <main>{children}</main>
    </div>
  );
}
