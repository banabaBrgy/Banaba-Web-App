"use client";

import { cn } from "@/lib/utils";
import { useLandingSidebar, useShowAssistant } from "@/utils/zustand";
import { AlignJustify } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export function Navbar() {
  const pathname = usePathname();
  const landingSidebar = useLandingSidebar();
  const showAssistant = useShowAssistant();

  const navLinks = [
    {
      id: "/",
      name: "home",
    },
    {
      id: "/service",
      name: "service",
    },
    {
      id: "/health-center",
      name: "health center",
    },
    {
      id: "/about-us",
      name: "about us",
    },
    {
      id: "/faq",
      name: "faq",
    },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 inset-x-0 h-14 flex justify-between px-3 z-[1000] text-white",
        pathname === "/" ? "bg-green-500/50 backdrop-blur-sm" : "bg-green-500"
      )}
    >
      <div
        className={cn(
          "flex items-center gap-3",
          pathname === "/" ? "invisible" : "visible"
        )}
      >
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Logo"
            width={400}
            height={399}
            priority
            className="slide-down lg:w-10 lg:h-10 w-9 h-9 rounded-full"
          />
        </Link>
        <h1 className="slide-down uppercase font-medium sm:block hidden text-sm">
          Barangay Banaba East Batangas City
        </h1>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          landingSidebar.setOpen();
        }}
        className={cn(
          "slide-down flex items-center lg:hidden visible",
          landingSidebar.isOpen && "invisible"
        )}
      >
        <AlignJustify />
      </button>

      <div className="slide-down lg:flex hidden items-center">
        {navLinks.map((link) => (
          <Link
            key={link.id}
            href={link.id}
            className={cn(
              "flex items-center uppercase text-xs h-full px-3",
              pathname === link.id && "bg-green-700"
            )}
          >
            <p
              className={cn(pathname === link.id && "scale-[.90] duration-200")}
            >
              {link.name}
            </p>
          </Link>
        ))}

        <Image
          src="/assistant-logo.png"
          alt="assistant-logo"
          width={200}
          height={200}
          priority
          onClick={(e) => {
            e.stopPropagation();
            !showAssistant.isOpen
              ? showAssistant.setOpen()
              : showAssistant.setClose();
          }}
          className="w-10 h-10 active:scale-[.95] cursor-pointer"
        />
      </div>
    </nav>
  );
}
