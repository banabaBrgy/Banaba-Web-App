"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ElementRef, useEffect, useRef } from "react";
import { FaHome, FaUsers } from "react-icons/fa";
import { GrServices } from "react-icons/gr";
import { GiHealthNormal } from "react-icons/gi";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import { AlignJustify } from "lucide-react";
import { useLandingSidebar } from "@/utils/zustand";

export default function Sidebar() {
  const setClose = useLandingSidebar((state) => state.setClose);
  const isOpen = useLandingSidebar((state) => state.isOpen);
  const sidebarRef = useRef<ElementRef<"div">>(null);
  const pathname = usePathname();

  const navLinks = [
    {
      id: "/",
      name: "home",
      icon: <FaHome size={17} />,
    },
    {
      id: "/service",
      name: "service",
      icon: <GrServices size={17} />,
    },
    {
      id: "/health-center",
      name: "health center",
      icon: <GiHealthNormal size={17} />,
    },
    {
      id: "/about-us",
      name: "about us",
      icon: <FaUsers size={17} />,
    },
    {
      id: "/faq",
      name: "faq",
      icon: <BsFillQuestionCircleFill size={17} />,
    },
  ];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!sidebarRef.current?.contains(e.target as any)) {
        setClose();
      }
    }

    window.addEventListener("click", handleClick);

    return () => window.addEventListener("click", handleClick);
  }, [setClose]);

  useEffect(() => {
    setClose();
  }, [pathname, setClose]);

  return (
    <div
      ref={sidebarRef}
      className={cn(
        "fixed inset-y-0 lg:hidden block bg-green-500 text-white shadow-xl w-[15rem] z-[1010] p-4 duration-200",
        isOpen ? "left-0" : "-left-[20rem]"
      )}
    >
      <div className="flex items-center justify-between">
        <button
          onClick={() => setClose()}
          className="group/resize bg-green-700 rounded-full w-10 h-10 flex items-center justify-center"
        >
          <AlignJustify
            size={22}
            className="scale-100 group-active/resize:scale-90"
          />
        </button>

        <Image
          src="/logo.png"
          alt="logo"
          width={500}
          height={500}
          priority
          className="w-12 h-12 object-cover"
        />
      </div>

      <div className="flex flex-col mt-7">
        {navLinks.map((navLink) => (
          <Link
            href={navLink.id}
            key={navLink.id}
            className={cn(
              "flex items-center gap-x-3 capitalize p-2 text-[14.5px]",
              pathname === navLink.id && "bg-green-700 rounded-md "
            )}
          >
            <span>{navLink.icon}</span>{" "}
            <span className="mt-1">{navLink.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
