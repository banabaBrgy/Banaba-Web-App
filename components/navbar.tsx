"use client";

import { useOpenSidebar } from "@/utils/zustand";
import { AlignJustify } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export function Navbar() {
  const setOpenSidebar = useOpenSidebar((s) => s.setOpenSidebar);

  return (
    <nav className="sticky top-0 flex items-center md:px-4 px-3 lg:ml-[16rem] bg-white h-14 border border-gray-200 z-[1001]">
      <div className="flex gap-2 items-center">
        <AlignJustify
          onClick={() => setOpenSidebar()}
          className="lg:hidden block"
        />

        <Link href="/">
          <Image
            src="/logo.png"
            alt="Logo"
            width={400}
            height={399}
            priority
            className="w-10 h-10 rounded-full"
          />
        </Link>

        <h1 className="uppercase sm:block hidden font-semibold text-gray-700">
          Barangay Banaba East Batangas City
        </h1>
      </div>
    </nav>
  );
}
