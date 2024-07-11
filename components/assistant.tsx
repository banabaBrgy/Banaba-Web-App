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
import { useChat } from "ai/react";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { UserType } from "@/lib/user";

interface AssistantProp {
  user: UserType | null;
}

export default function Assistant({ user }: AssistantProp) {
  const cardRef = useRef<ElementRef<"div">>(null);
  const pathname = usePathname();
  const setClose = useShowAssistant((state) => state.setClose);
  const isOpen = useShowAssistant((state) => state.isOpen);
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const ref = useRef<ElementRef<"div">>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!cardRef.current?.contains(e.target as any)) {
        setClose();
      }
    }

    window.addEventListener("click", handleClick);

    return () => window.removeEventListener("click", handleClick);
  }, [setClose]);

  useEffect(() => {
    if (ref.current) {
      const isBottom =
        ref.current.scrollHeight -
        (ref.current.scrollTop + ref.current.clientHeight);

      if (isBottom <= 100) {
        ref.current.scrollTo({ top: ref.current.scrollHeight });
      }
    }
  }, [messages]);

  if (pathname === "/log-in" || pathname === "/register") return;

  return (
    <Card
      ref={cardRef}
      className={cn(
        "fixed sm:right-4 right-0 flex flex-col sm:w-[28rem] sm:h-[37rem] h-full w-full rounded-b-none sm:rounded-t-lg rounded-none z-[1010] duration-300 shadow-xl overflow-hidden",
        isOpen ? "bottom-0" : "bottom-[-60rem]"
      )}
    >
      <CardHeader className="p-4 shadow">
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

      <CardContent
        id="scrollParent"
        ref={ref}
        className="px-4 py-5 overflow-auto flex-1 bg-zinc-100 space-y-5 border-none"
      >
        {!!messages.length &&
          messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                "flex gap-2",
                m.role === "user"
                  ? "justify-end"
                  : "justify-end flex-row-reverse"
              )}
            >
              <div className="p-2 bg-white shadow rounded-md text-sm max-w-[19rem] whitespace-pre-wrap break-words">
                <ReactMarkdown
                  components={{
                    a: ({ node, ref, ...props }) => (
                      <Link
                        {...props}
                        href={props.href ?? ""}
                        className="text-blue-500 hover:underline"
                      />
                    ),
                  }}
                >
                  {m.content}
                </ReactMarkdown>
              </div>
              <Image
                src={
                  m.role === "assistant"
                    ? "/logo.png"
                    : user?.profile || "/no-profile.webp"
                }
                alt="no-profile"
                width={200}
                height={299}
                priority
                className="w-8 h-8 rounded-full"
              />
            </div>
          ))}
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            No conversation yet
          </div>
        )}
      </CardContent>

      <CardFooter className="px-4 py-2 shadow">
        <form
          onSubmit={handleSubmit}
          onKeyDown={(e) => e.keyCode === 13 && handleSubmit(e)}
          className="relative flex items-center gap-3 w-full"
        >
          <TextareaAutosize
            maxRows={4}
            value={input}
            onChange={handleInputChange}
            placeholder="Start asking me..."
            className="sidebar rounded-md shadow-md resize-none outline-none ring-gray-400 border border-gray-400 flex-1 text-sm py-[10px] pl-3 pr-12"
          />

          <div className="absolute right-1 scroll-mr-3 inset-y-1 flex items-center">
            <button
              type="submit"
              className="border p-2 bg-green-500 rounded-md"
            >
              <IoSend className="text-white" cursor="pointer" />
            </button>
          </div>
        </form>
      </CardFooter>
    </Card>
  );
}
