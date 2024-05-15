import React, { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        background: `url(/waves.svg)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
        backgroundPosition: "top",
        backgroundColor: "rgb(243 244 246)",
      }}
      className="relative flex items-center justify-center min-h-[100dvh]"
    >
      {children}
    </div>
  );
}
