"use client";

import { cn } from "@/lib/utils";
import { useShowAssistant } from "@/utils/zustand";
import { AlignJustify } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export function Navbar() {
  const pathname = usePathname();
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
          "flex items-center gap-2",
          pathname === "/" ? "invisible" : "visible"
        )}
      >
        <Image
          src="/logo.png"
          alt="Logo"
          width={400}
          height={399}
          priority
          className="slide-down w-11 h-11 rounded-full"
        />
        <h1 className="slide-down uppercase font-medium sm:block hidden">
          Barangay Banaba East Batangas City
        </h1>
      </div>

      <div className="slide-down flex items-center">
        <AlignJustify className="lg:hidden block" />
      </div>

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
            showAssistant.setOpen();
          }}
          className="w-10 h-10 active:scale-[.95] cursor-pointer"
        />
      </div>
    </nav>
  );
}
