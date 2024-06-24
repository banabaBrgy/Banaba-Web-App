"use client";

import { Button } from "@/components/ui/button";
import { UserType } from "@/lib/user";
import { cn } from "@/lib/utils";
import { useOpenSidebar } from "@/utils/zustand";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import { MdDashboard, MdAnnouncement } from "react-icons/md";
import { FaClipboardList, FaFileAlt } from "react-icons/fa";
import { RiInkBottleFill, RiQuestionFill } from "react-icons/ri";
import { GrServices } from "react-icons/gr";

interface SidebarProp {
  user: UserType | null;
}

export function Sidebar({ user }: SidebarProp) {
  const pathname = usePathname();
  const setOpenSidebar = useOpenSidebar((s) => s.setOpenSidebar);
  const isSidebarOpen = useOpenSidebar((s) => s.isSidebarOpen);

  const sidebarLinks = [
    { id: "/resident", name: "Dashboard", icon: <MdDashboard size={20} /> },
    {
      id: "/resident/my-request",
      name: "My request",
      icon: <FaFileAlt size={20} />,
    },
    {
      id: "/resident/announcement",
      name: "Announcement",
      icon: <MdAnnouncement size={20} />,
    },
    {
      id: "/resident/programs",
      name: "Programs",
      icon: <FaClipboardList size={18} />,
    },
    {
      id: "/resident/inquiries",
      name: "Inquiries",
      icon: <RiQuestionFill size={20} />,
    },
    {
      id: "/resident/blotter",
      name: "Blotter",
      icon: <RiInkBottleFill size={20} />,
    },
    {
      id: "/resident/services",
      name: "Services",
      icon: <GrServices size={20} />,
    },
  ];

  useEffect(() => {
    setOpenSidebar();
  }, [pathname, setOpenSidebar]);

  return (
    <div
      className={cn(
        "fixed inset-y-0 bg-green-500 text-white w-[16rem] px-5 duration-200 z-[1001]",
        !isSidebarOpen ? "lg:left-0 left-[-20rem]" : "left-0"
      )}
    >
      <div className="mt-4 lg:hidden">
        <Button
          onClick={() => setOpenSidebar()}
          size="icon"
          style={{ boxShadow: "1px 1px 7px rgba(0, 0, 0, .2)" }}
          className="bg-green-600 hover:bg-green-600 active:scale-[.95]"
        >
          <ChevronLeft size={20} />
        </Button>
      </div>

      <div className="flex items-center gap-3 mt-5">
        <Link
          href="/resident/profile"
          className="relative active:scale-[.95] shrink-0"
        >
          <Image
            src={user?.profile || "/no-profile.webp"}
            alt="profile"
            width={300}
            height={200}
            priority
            className="w-12 h-12 object-cover rounded-full"
          />
          {/*  <span className="absolute -top-1 right-1 bg-red-500 p-[7px] rounded-full" /> */}
        </Link>

        <div className="space-y-1 flex-1">
          <p className="font-semibold text-lg break-words break-all line-clamp-1">
            {user?.firstName}
          </p>
          <p className="text-xs">{user?.role}</p>
        </div>
      </div>

      <div className="flex flex-col mt-8">
        {sidebarLinks.map((item) => (
          <Link
            href={item.id}
            key={item.id}
            className={cn(
              "flex items-center gap-2 p-3 rounded-md text-sm duration-200 hover:bg-green-500/60",
              pathname === item.id && "bg-white hover:bg-white text-black"
            )}
          >
            {item.icon} {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
