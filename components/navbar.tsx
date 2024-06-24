"use client";

import { useOpenSidebar, useShowAssistant } from "@/utils/zustand";
import { AlignJustify } from "lucide-react";
import { RiNotification3Fill } from "react-icons/ri";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export function Navbar() {
  const showAssistant = useShowAssistant();
  const setOpenSidebar = useOpenSidebar((s) => s.setOpenSidebar);

  return (
    <nav className="sticky top-0 flex items-center justify-between md:px-4 px-3 lg:ml-[16rem] bg-white h-14 border-b border-[#dddddd] shadow-sm z-[1001]">
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

        <h1 className="uppercase sm:block hidden font-medium">
          Barangay Banaba East Batangas City
        </h1>
      </div>

      <div className="flex items-center gap-2 text-gray-500">
        <RiNotification3Fill className="text-[22px]" />
        <Image
          src="/assistant-logo.png"
          alt="assistant-logo"
          onClick={() => showAssistant.setOpen()}
          width={100}
          height={100}
          priority
          title="Assistant"
          className="w-10 h-10 active:scale-[.95] cursor-pointer"
        />
      </div>
    </nav>
  );
}
