"use client";

import React, { ElementRef, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import TextareaAutosize from "react-textarea-autosize";
import { IoSend } from "react-icons/io5";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { IoChevronDownOutline } from "react-icons/io5";
import { useShowAssistant } from "@/utils/zustand";
import { usePathname } from "next/navigation";

export default function Assistant() {
  const cardRef = useRef<ElementRef<"div">>(null);
  const pathname = usePathname();
  const setClose = useShowAssistant((state) => state.setClose);
  const isOpen = useShowAssistant((state) => state.isOpen);
  const message = [
    {
      id: "user",
      content: "My Message cdscsdcdsdscsc  kmsdkcmskmdcskdmc",
    },
    {
      id: "ai",
      content: "Assistant Message nsjncjsdncjsdncjsdnc ncjsncjsdcnsdjn",
    },
    { id: "user", content: "My Message" },
  ];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!cardRef.current?.contains(e.target as any)) {
        setClose();
      }
    }

    window.addEventListener("click", handleClick);

    return () => window.removeEventListener("click", handleClick);
  }, [setClose]);

  if (pathname === "/log-in" || pathname === "/register") return;

  return (
    <Card
      ref={cardRef}
      className={cn(
        "fixed sm:right-4 right-0 flex flex-col sm:w-[26rem] sm:h-[37rem] h-full w-full rounded-b-none sm:rounded-t-lg rounded-none z-[1010] duration-300 shadow-2xl overflow-hidden",
        isOpen ? "bottom-0" : "bottom-[-60rem]"
      )}
    >
      <CardHeader className="p-3 shadow">
        <div className="flex items-center justify-between">
          <CardTitle>Assistant</CardTitle>
          <IoChevronDownOutline
            onClick={() => setClose()}
            className="text-2xl"
            cursor="pointer"
          />
        </div>
        <CardDescription>Ask me anything about us.</CardDescription>
      </CardHeader>

      <CardContent className="px-3 py-5 overflow-auto flex-1 space-y-5">
        {message.map((m, idx) => (
          <div
            key={idx}
            className={cn(
              "flex gap-2",
              m.id === "user" ? "justify-end" : "justify-end flex-row-reverse"
            )}
          >
            <p className="p-2 border border-zinc-300 shadow-md rounded-md text-sm break-words break-all max-w-[14rem] whitespace-pre-wrap">
              {m.content}
            </p>
            <Image
              src="/no-profile.webp"
              alt="no-profile"
              width={200}
              height={299}
              priority
              className="w-8 h-8 rounded-full"
            />
          </div>
        ))}
      </CardContent>

      <CardFooter className="p-3">
        <form action="" className="flex items-center gap-3 w-full">
          <TextareaAutosize
            maxRows={4}
            className="rounded-md shadow-md resize-none outline-none focus:ring-2 ring-offset-2 ring-gray-400 border border-gray-300 flex-1 text-sm py-[9px] px-3"
            placeholder="Ask me"
          />
          <IoSend className="text-green-500 text-xl" cursor="pointer" />
        </form>
      </CardFooter>
    </Card>
  );
}
