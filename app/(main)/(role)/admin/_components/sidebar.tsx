"use client";

import { Button } from "@/components/ui/button";
import { UserType } from "@/lib/user";
import { cn } from "@/lib/utils";
import { useOpenSidebar } from "@/utils/zustand";
import { ChevronLeft, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useTransition } from "react";
import {
  MdDashboard,
  MdAnnouncement,
  MdOutlinePendingActions,
} from "react-icons/md";
import { RiFoldersFill } from "react-icons/ri";
import { IoDocument } from "react-icons/io5";
import { FaClipboardList } from "react-icons/fa";
import {
  RiQuestionFill,
  RiInkBottleFill,
  RiArchiveDrawerFill,
} from "react-icons/ri";
import { GrServices } from "react-icons/gr";
import { ImUsers } from "react-icons/im";
import { AiFillDislike, AiFillLike } from "react-icons/ai";
import { DocumentRequest, Inquiries } from "@prisma/client";
import { generate } from "@/action/generate-ai";
import { toast } from "sonner";

interface SidebarProp {
  user: UserType | null;
  pendingRequest:
    | (DocumentRequest & {
        requestedBy: {
          fullName: string;
        };
      })[]
    | null;
  noAnswersInquiries: Inquiries[] | undefined;
}

export function Sidebar({
  user,
  pendingRequest,
  noAnswersInquiries,
}: SidebarProp) {
  const [pending, setTransition] = useTransition();
  const pathname = usePathname();
  const setCloseSidebar = useOpenSidebar((s) => s.setClose);
  const isSidebarOpen = useOpenSidebar((s) => s.isSidebarOpen);

  const sidebarLinks = [
    { id: "/admin", name: "Dashboard", icon: <MdDashboard size={20} /> },
    { id: "/admin/files", name: "Files", icon: <RiFoldersFill size={20} /> },
    {
      id: "/admin/announcement",
      name: "Announcement",
      icon: <MdAnnouncement size={20} />,
    },
    {
      id: "/admin/programs",
      name: "Programs",
      icon: <FaClipboardList size={18} />,
    },
    {
      id: "/admin/inquiries",
      name: "Inquiries",
      icon: <RiQuestionFill size={20} />,
    },
    {
      id: "/admin/blotter",
      name: "Blotter",
      icon: <RiInkBottleFill size={20} />,
    },
    { id: "/admin/services", name: "Services", icon: <GrServices size={20} /> },
  ];

  const settings = [
    {
      id: "/admin/document-type",
      name: "Document Type",
      icon: <IoDocument size={20} />,
    },
    {
      id: "/admin/system-users",
      name: "System User's",
      icon: <ImUsers size={20} />,
    },
  ];

  const documentRequest = [
    {
      id: "/admin/request-pending",
      name: "Request Pending",
      icon: <MdOutlinePendingActions size={20} />,
    },
    {
      id: "/admin/request-approved",
      name: "Request Approved",
      icon: <AiFillLike size={20} />,
    },
    {
      id: "/admin/request-disapproved",
      name: "Request Disapproved",
      icon: <AiFillDislike size={20} />,
    },
    {
      id: "/admin/request-archived",
      name: "Request Archived",
      icon: <RiArchiveDrawerFill size={20} />,
    },
  ];

  useEffect(() => {
    setCloseSidebar();
  }, [pathname, setCloseSidebar]);

  return (
    <div
      className={cn(
        "sidebar fixed inset-y-0 bg-gradient-to-r from-green-600 via-green-500 to-green-400 text-white w-[16rem] px-5 duration-200 z-[1001] overflow-auto",
        !isSidebarOpen ? "left-[-20rem]" : "left-0"
      )}
    >
      <div className="flex items-center gap-3 mt-5">
        <Link
          href="/admin/profile"
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
        </Link>

        <div className="flex items-center gap-2 flex-1">
          <div className="max-w-[6.5rem] flex-1">
            <Link href="/admin/profile">
              <p className="font-semibold text-lg truncate">
                {user?.firstName}
              </p>
            </Link>
            <p className="text-xs">{user?.role}</p>
          </div>

          <Button
            onClick={() => setCloseSidebar()}
            size="icon"
            style={{ boxShadow: "1px 1px 7px rgba(0, 0, 0, .2)" }}
            className="bg-green-600 hover:bg-green-600 active:scale-[.95] shrink-0"
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
              pathname === item.id ||
                (pathname?.includes("/admin/files") &&
                  item.id === "/admin/files")
                ? "bg-white hover:bg-white text-black"
                : ""
            )}
          >
            <p className="flex items-center gap-2">
              {item.icon} {item.name}
            </p>{" "}
            {item.name === "Inquiries" && !!noAnswersInquiries?.length && (
              <span className="flex items-center justify-center bg-red-500 h-5 w-5 rounded-full text-[11px] text-white">
                {noAnswersInquiries.length}
              </span>
            )}
          </Link>
        ))}
      </div>

      <div className="mt-4">
        <p className="font-semibold">Document Request</p>

        <div className="flex flex-col mt-4">
          {documentRequest.map((item) => (
            <Link
              href={item.id}
              key={item.id}
              className={cn(
                "flex items-center justify-between p-3 rounded-md text-sm duration-200 hover:bg-green-700",
                pathname === item.id && "bg-white hover:bg-white text-black"
              )}
            >
              <p className="flex items-center gap-2">
                {item.icon} {item.name}
              </p>{" "}
              {item.name.includes("Pending") && !!pendingRequest?.length && (
                <span className="flex items-center justify-center bg-red-500 h-5 w-5 rounded-full text-[11px] text-white">
                  {pendingRequest?.length}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <p className="font-semibold">Settings</p>

        <div className="flex flex-col mt-4">
          {settings.map((item) => (
            <Link
              href={item.id}
              key={item.id}
              className={cn(
                "flex items-center gap-2 p-3 rounded-md text-sm duration-200 hover:bg-green-700",
                pathname === item.id && "bg-white hover:bg-white text-black"
              )}
            >
              {item.icon} {item.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="sticky bottom-2 inset-x-4 mt-8 invisible">
        <Button
          onClick={() =>
            setTransition(async () => {
              await generate()
                .then(() => toast.success("Sync info successfully"))
                .catch(() => toast.error("Something went wrong"));
            })
          }
          disabled={pending}
          className="w-full bg-black/60 disabled:opacity-90 hover:bg-black/60 text-sm uppercase backdrop-blur-xl active:scale-95"
        >
          {pending ? (
            <span className="flex items-center gap-2">
              <Loader2 className="animate-spin" /> Syncing...
            </span>
          ) : (
            "Sync info to ai"
          )}
        </Button>
      </div>
    </div>
  );
}
