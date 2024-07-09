"use client";

import { cn } from "@/lib/utils";
import { Inquiries } from "@prisma/client";
import React, { ElementRef, useEffect, useRef } from "react";

type InquiriesRowProp = {
  inquiries: Inquiries[] | undefined;
  id: string;
};

export function InquiriesRow({ inquiries, id }: InquiriesRowProp) {
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
            {inquiries?.map((inquirie) => (
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