"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function Sidebar() {
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
    <>
      <div className="fixed left-0 inset-y-0 bg-white lg:hidden  sm:w-[20rem] w-full z-[1010]">
        <button className="px-5 mt-5" title="Close sidebar">
          <X className="scale-[.90]" />
        </button>

        <Card className="border-none shadow-none bg-none">
          <CardHeader>
            <CardTitle>Links</CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col uppercase border-none">
            {navLinks.map((link) => (
              <Link
                href={link.id}
                key={link.id}
                className={cn(
                  "flex items-center h-12 px-3 hover:bg-gray-200",
                  pathname === link.id && "bg-gray-200 rounded-md"
                )}
              >
                {link.name}
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-none shadow-none border-none">
          <CardHeader>
            <CardTitle>Assistant</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex items-center h-12 gap-2 cursor-pointer">
              <Image
                src="/assistant-logo.png"
                alt="assistant-logo"
                width={200}
                height={200}
                priority
                className="w-10 h-10 active:scale-[.95] cursor-pointer"
              />
              <p>Assistant</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="fixed inset-0 bg-black/80 z-[1009] lg:hidden" />
    </>
  );
}
