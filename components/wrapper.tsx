"use client";

import { cn } from "@/lib/utils";
import { useOpenSidebar } from "@/utils/zustand";
import { ReactNode } from "react";

export const Wrapper = ({ children }: { children: ReactNode }) => {
  const { isSidebarOpen } = useOpenSidebar();

  return (
    <div
      className={cn(
        "duration-200",
        isSidebarOpen ? "lg:ml-[16rem] ml-0" : "ml-0"
      )}
    >
      {children}
    </div>
  );
};
