"use client";

import React, { ElementRef, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
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
import { HiDotsHorizontal } from "react-icons/hi";

interface AssistantProp {
  user: UserType | null;
}

export default function Assistant({ user }: AssistantProp) {
  const cardRef = useRef<ElementRef<"div">>(null);
  const pathname = usePathname();
  const setClose = useShowAssistant((state) => state.setClose);
  const isOpen = useShowAssistant((state) => state.isOpen);
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setInput,
  } = useChat();
  const ref = useRef<ElementRef<"div">>(null);

  const isUser = messages.at(-1)?.role === "user";

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

      if (isBottom <= 300) {
        ref.current.scrollTo({ top: ref.current.scrollHeight });
      }
    }
  }, [messages]);

  if (pathname === "/log-in" || pathname === "/register") return;

  return (
    <Card
      ref={cardRef}
      className={cn(
        "fixed sm:right-4 right-0 flex flex-col sm:w-[28rem] sm:h-[37rem] h-full w-full rounded-b-none sm:rounded-t-lg rounded-none z-[1010] duration-300 shadow-xl border border-zinc-300 overflow-hidden",
        isOpen ? "bottom-0" : "bottom-[-60rem]"
      )}
    >
      <CardHeader className="px-4 py-2 shadow">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Assistant</CardTitle>
          <IoChevronDownOutline
            onClick={() => setClose()}
            className="text-xl text-zinc-500"
            cursor="pointer"
          />
        </div>
      </CardHeader>

      <CardContent
        id="scrollParent"
        ref={ref}
        className="px-4 py-5 overflow-auto flex-1 bg-zinc-100 space-y-5 border-none"
      >
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              "flex gap-2",
              m.role === "user" ? "justify-end" : "justify-end flex-row-reverse"
            )}
          >
            <div
              className={cn(
                "p-2 bg-white shadow text-sm max-w-[19rem] whitespace-pre-wrap break-words",
                m.role === "user"
                  ? "rounded-l-xl rounded-br-xl mt-3"
                  : "rounded-r-xl rounded-bl-xl mt-3"
              )}
            >
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

        {isUser && isLoading && (
          <div className="flex gap-2">
            <Image
              src="/logo.png"
              alt="no-profile"
              width={200}
              height={299}
              priority
              className="w-8 h-8 rounded-full"
            />
            <p className="flex gap-1 items-center bg-white p-3 rounded-md text-sm shadow rounded-r-xl rounded-bl-xl mt-3">
              <span className="bg-zinc-400 h-2 w-2 animate-pulse rounded-full" />
              <span className="bg-zinc-400 h-2 w-2 animate-pulse rounded-full" />
              <span className="bg-zinc-400 h-2 w-2 animate-pulse rounded-full" />
            </p>
          </div>
        )}

        {messages.length === 0 && (
          <div className="flex flex-col gap-2 items-center justify-center h-full mx-4">
            <p className="font-medium text-center">
              {user?.firstName ? `Hi ${user.firstName},` : "Hi,"} I&apos;m your
              Barangay Banaba virtual assistant.
            </p>
            <p className="text-sm text-center text-zinc-500">
              If you need help with information related to Barangay Banaba East,
              ask me, and I will answer immediately.
            </p>

            <small className="text-center text-zinc-500">
              (To get accurate answers, please ask questions related to Barangay
              Banaba.)
            </small>
          </div>
        )}
      </CardContent>

      <CardFooter className="px-4 py-2 shadow">
        <form
          onSubmit={(e) => {
            ref.current?.scrollTo({ top: ref.current?.scrollHeight });
            handleSubmit(e);
          }}
          onKeyDown={(e) => {
            if (e.ctrlKey && e.keyCode === 13) {
              return setInput((prev) => `${prev}\n`);
            }

            if (e.keyCode === 13 && !isLoading) {
              ref.current?.scrollTo({ top: ref.current?.scrollHeight });
              handleSubmit(e);
            }
          }}
          className="relative flex items-center gap-3 w-full"
        >
          <TextareaAutosize
            maxRows={4}
            value={input}
            onChange={handleInputChange}
            placeholder="Start asking me..."
            spellCheck={false}
            className="sidebar rounded-md shadow-md resize-none outline-none ring-gray-400 border border-gray-300 flex-1 text-sm py-[10px] pl-3 pr-12"
          />
          <div className="absolute right-1 scroll-mr-3 inset-y-1 flex items-center">
            <button
              disabled={isLoading}
              type="submit"
              className="p-2 rounded-md disabled:opacity-60"
            >
              <IoSend className="text-green-500 scale-[1.2]" cursor="pointer" />
            </button>
          </div>
        </form>
      </CardFooter>
    </Card>
  );
}
