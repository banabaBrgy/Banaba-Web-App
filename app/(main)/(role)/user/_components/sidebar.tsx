"use client";

import { Button } from "@/components/ui/button";
import { UserType } from "@/lib/user";
import { cn } from "@/lib/utils";
import { useOpenSidebar } from "@/utils/zustand";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ElementRef, useEffect, useRef } from "react";
import { MdDashboard, MdAnnouncement } from "react-icons/md";
import { FaClipboardList, FaFileAlt } from "react-icons/fa";
import { RiInkBottleFill, RiQuestionFill } from "react-icons/ri";
import { GrServices } from "react-icons/gr";
import { IoMdAlert } from "react-icons/io";

interface SidebarProp {
  user: UserType | null;
  unreadAnnouncement: number;
  unreadPrograms: number;
}

export function Sidebar({
  user,
  unreadAnnouncement,
  unreadPrograms,
}: SidebarProp) {
  const pathname = usePathname();
  const setCloseSidebar = useOpenSidebar((s) => s.setClose);
  const isSidebarOpen = useOpenSidebar((s) => s.isSidebarOpen);
  const sidebarRef = useRef<ElementRef<"div">>(null);

  const sidebarLinks = [
    { id: "/user", name: "Dashboard", icon: <MdDashboard size={20} /> },
    {
      id: "/user/my-request",
      name: "My request",
      icon: <FaFileAlt size={20} />,
    },
    {
      id: "/user/announcement",
      name: "Announcement",
      icon: <MdAnnouncement size={20} />,
    },
    {
      id: "/user/programs",
      name: "Programs",
      icon: <FaClipboardList size={18} />,
    },
    {
      id: "/user/inquiries",
      name: "Inquiries",
      icon: <RiQuestionFill size={20} />,
    },
    {
      id: "/user/blotter",
      name: "Blotter",
      icon: <RiInkBottleFill size={20} />,
    },
    {
      id: "/user/services",
      name: "Services",
      icon: <GrServices size={20} />,
    },
  ];

  useEffect(() => {
    setCloseSidebar();
  }, [pathname, setCloseSidebar]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!sidebarRef.current?.contains(e.target as any)) {
        setCloseSidebar();
      }
    }

    window.addEventListener("click", handleClick);

    return () => window.removeEventListener("click", handleClick);
  }, [setCloseSidebar]);

  const missingProfileInfo =
    !user?.birthDate ||
    !user?.age ||
    !user?.gender ||
    !user?.civilStatus ||
    !user?.placeOfBirth ||
    !user?.sitioPurok ||
    !user?.mobile;

  return (
    <div
      ref={sidebarRef}
      className={cn(
        "fixed inset-y-0 bg-green-500 text-white w-[16rem] px-5 duration-200 z-[1001]",
        isSidebarOpen ? "left-0" : "left-[-20rem]"
      )}
    >
      <div className="flex items-center gap-3 mt-5">
        <Link
          href="/user/profile"
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
          {missingProfileInfo && (
            <IoMdAlert className="absolute -top-1 right-1 text-red-500 shrink-0 bg-green-500 rounded-full scale-125" />
          )}
        </Link>

        <div className="flex items-center gap-2 flex-1">
          <div className="max-w-[6.5rem] flex-1">
            <p className="font-semibold text-lg break-words break-all line-clamp-1">
              {user?.firstName}
            </p>
            <p className="text-xs">{user?.role}</p>
          </div>

          <Button
            onClick={() => setCloseSidebar()}
            size="icon"
            style={{ boxShadow: "1px 1px 7px rgba(0, 0, 0, .2)" }}
            className="bg-green-600 hover:bg-green-600 active:scale-[.95]"
          >
            <ChevronLeft size={20} />
          </Button>
        </div>
      </div>

      <div className="flex flex-col mt-8">
        {sidebarLinks.map((item) => (
          <Link
            href={item.id}
            key={item.id}
            className={cn(
              "flex items-center justify-between gap-2 p-3 rounded-md text-sm duration-200 hover:bg-green-700",
              pathname === item.id && "bg-white hover:bg-white text-black"
            )}
          >
            <p className="flex items-center gap-2">
              {item.icon} {item.name}
            </p>{" "}
            {item.name === "Announcement" && !!unreadAnnouncement && (
              <span className="flex items-center justify-center bg-red-500 h-5 w-5 rounded-full text-[11px] text-white">
                {unreadAnnouncement}
              </span>
            )}
            {item.name === "Programs" && !!unreadPrograms && (
              <span className="flex items-center justify-center bg-red-500 h-5 w-5 rounded-full text-[11px] text-white">
                {unreadPrograms}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
