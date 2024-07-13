"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Inquiries } from "@prisma/client";
import React, { ElementRef, useEffect, useRef, useState } from "react";
import { MdOutlineSearch } from "react-icons/md";

type InquiriesRowProp = {
  inquiries: Inquiries[] | undefined;
  id: string;
};

export function InquiriesRow({ inquiries, id }: InquiriesRowProp) {
  const [search, setSearch] = useState("");
  const refs = useRef<{ [key: string]: ElementRef<"tr"> | null }>({});

  const tableHead = ["Subject", "Message", "Answer"];

  useEffect(() => {
    if (id && refs.current[id]) {
      refs?.current[id]?.scrollIntoView({
        block: "center",
        inline: "center",
        behavior: "smooth",
      });
    }
  }, [id]);

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="sm:text-lg text-sm font-semibold uppercase">
          My Inquiries
        </h1>

        <div className="relative flex items-center ml-auto flex-1 sm:max-w-[20rem] max-w-[12rem]">
          <MdOutlineSearch className="absolute right-3 scale-[1.4] text-zinc-400" />
          <Input
            onChange={(e) => setSearch(e.target.value.toLowerCase())}
            type="text"
            placeholder="Search"
            className="pr-10"
          />
        </div>
      </div>

      <div className="overflow-auto">
        <table className="border-collapse bg-white w-full">
          <thead>
            <tr>
              {tableHead.map((th) => (
                <th
                  key={th}
                  className="border border-green-500 bg-green-500 p-2 text-white font-medium uppercase text-sm"
                >
                  {th}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {inquiries
              ?.filter(
                (inquiries) =>
                  inquiries.answer?.toLowerCase().includes(search) ||
                  inquiries.subject.toLowerCase().includes(search) ||
                  inquiries.message.toLowerCase().includes(search)
              )
              ?.map((inquirie) => (
                <tr
                  ref={(el) => {
                    refs.current[inquirie.id] = el;
                  }}
                  key={inquirie.id}
                  className={cn(
                    "text-sm text-center",
                    inquirie.id === id && "bg-green-100"
                  )}
                >
                  <td className="border border-[#dddddd] p-2">
                    {inquirie.subject}
                  </td>
                  <td className="border border-[#dddddd] p-2">
                    {inquirie.message}
                  </td>
                  <td className="border border-[#dddddd] p-2">
                    {inquirie.answer}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
