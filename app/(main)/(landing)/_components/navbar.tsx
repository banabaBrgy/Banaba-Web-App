"use client";

import { cn } from "@/lib/utils";
import { AlignJustify } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export function Navbar() {
  const pathname = usePathname();
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
        "fixed top-0 inset-x-0 h-14 flex justify-between backdrop-blur-sm px-3 z-[1000] text-white",
        pathname === "/" ? "bg-green-500/70" : "bg-green-500 shadow-xl"
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
          className="w-11 h-11 rounded-full"
        />
        <h1 className="uppercase font-medium sm:block hidden">
          Barangay Banaba East Batangas City
        </h1>
      </div>

      <div className="flex items-center">
        <AlignJustify className="lg:hidden block" />
      </div>

      <div className="lg:flex hidden items-center">
        {navLinks.map((links) => (
          <Link
            key={links.id}
            href={links.id}
            className={cn(
              "flex items-center uppercase text-xs h-full px-3",
              pathname === links.id && "bg-green-700"
            )}
          >
            {links.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}
