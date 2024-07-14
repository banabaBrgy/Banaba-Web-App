"use client";

import {
  useOpenSidebar,
  useShowAssistant,
  useUnreadNotificationLength,
} from "@/utils/zustand";
import { AlignJustify } from "lucide-react";
import { RiNotification3Fill } from "react-icons/ri";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { UserType } from "@/lib/user";
import AdminNotification from "./admin-notification";

interface NavbarProp {
  user: UserType | null;
}

export function Navbar({ user }: NavbarProp) {
  const showAssistant = useShowAssistant();
  const openSidebar = useOpenSidebar();
  const [openNotif, setOpenNotif] = useState(false);
  const [timeDate, setTimeDate] = useState("");
  const adminUnreadNotifications = useUnreadNotificationLength(
    (s) => s.adminUnreads
  );

  useEffect(() => {
    function handleClick() {
      setOpenNotif(false);
    }

    window.addEventListener("click", handleClick);

    return () => window.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const dateTimeFormatter = Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "medium",
      });

      const dateNow = dateTimeFormatter.format(new Date());
      setTimeDate(`${dateNow}`);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <nav className="sticky top-0 flex items-center justify-between md:px-4 px-3 lg:ml-[16rem] bg-white h-14 z-[1001]">
      <div className="flex gap-2 items-center">
        <AlignJustify
          onClick={() => openSidebar.setOpen()}
          className="lg:hidden block"
        />

        <Link href="/">
          <Image
            src="/logo.png"
            alt="Logo"
            width={400}
            height={399}
            priority
            className="w-9 h-9 rounded-full"
          />
        </Link>

        <h1 className="uppercase sm:block hidden font-semibold text-[13.3px]">
          Barangay Banaba East Batangas City
        </h1>
      </div>

      <div className="flex items-center gap-1 text-gray-500">
        <div className="flex items-center text-sm mr-2">
          <p>{timeDate}</p>
        </div>

        <div onClick={(e) => e.stopPropagation()} className="relative">
          <Button
            onClick={() => {
              showAssistant.setClose();
              setOpenNotif(!openNotif);
            }}
            className={cn(
              "relative active:scale-90 rounded-full",
              openNotif ? "text-black bg-secondary" : ""
            )}
            size="sm"
            variant="ghost"
          >
            {!!adminUnreadNotifications && (
              <span className="absolute top-0 right-0 flex items-center justify-center text-white text-[10px] h-5 w-5 rounded-full bg-red-500 z-[10]">
                {adminUnreadNotifications}
              </span>
            )}
            <RiNotification3Fill className="scale-[1.4]" />
          </Button>

          <div
            className={cn(
              "absolute top-11 right-0 flex flex-col w-[25rem] max-h-[33rem] border border-zinc-200 shadow-xl rounded-md bg-white text-black duration-150",
              openNotif
                ? "scale-100 visible opacity-100"
                : "scale-95 invisible opacity-0"
            )}
          >
            <AdminNotification user={user} setOpenNotif={setOpenNotif} />
          </div>
        </div>

        <Image
          src="/assistant-logo.png"
          alt="assistant-logo"
          onClick={(e) => {
            e.stopPropagation();
            showAssistant.isOpen
              ? showAssistant.setClose()
              : showAssistant.setOpen();
            setOpenNotif(false);
          }}
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
