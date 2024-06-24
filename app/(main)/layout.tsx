import Assistant from "@/components/assistant";
import React, { ReactNode } from "react";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Assistant />
      <main>{children}</main>
    </div>
  );
}
