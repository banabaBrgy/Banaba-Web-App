"use client";

import ReactToPrint from "@/components/react-to-print";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import React, { ElementRef, useEffect, useRef, useState } from "react";
import { MdOutlineSearch } from "react-icons/md";

interface BlotterRowProp {
  blotters:
    | {
        id: string;
        userId: string;
        incident: string;
        placeOfIncident: string;
        dateTime: string;
        witnesses: string[];
        narrative: string;
        createdAt: Date;
        updatedAt: Date;
        user: {
          fullName: string;
          sitioPurok: string | null;
        };
      }[]
    | null;
  id: string;
}

export default function BlotterRow({ blotters, id }: BlotterRowProp) {
  const [search, setSearch] = useState("");
  const refs = useRef<{ [key: string]: ElementRef<"tr"> | null }>({});

  const tableHead = [
    "No.",
    "Narrator/Complainant",
    "Sitio/Purok",
    "Incidents",
    "Place of incidents",
    "Witnesses",
    "Date registered",
    "Print",
  ];

  useEffect(() => {
    if (id && refs.current[id]) {
      refs?.current[id]?.scrollIntoView({
        inline: "center",
        block: "center",
        behavior: "smooth",
      });
    }
  }, [id]);

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold uppercase">Blotter</h1>

        <div className="relative flex items-center flex-1 max-w-[20rem]">
          <MdOutlineSearch className="absolute right-3 scale-[1.4] text-zinc-400" />
          <Input
            onChange={(e) => setSearch(e.target.value.toLowerCase())}
            type="text"
            placeholder="Search"
            className="pr-10"
          />
        </div>
      </div>

      <div className="overflow-auto mt-4">
        <table className="border-collapse w-full bg-white">
          <thead>
            <tr>
              {tableHead.map((th) => (
                <th
                  key={th}
                  className="border border-green-500 bg-green-500 p-2 text-center text-white font-normal whitespace-nowrap uppercase text-sm"
                >
                  {th}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {blotters
              ?.filter(
                (blotter) =>
                  blotter.user.fullName.toLowerCase().includes(search) ||
                  blotter.user.sitioPurok?.toLowerCase().includes(search) ||
                  blotter.incident.toLowerCase().includes(search) ||
                  blotter.placeOfIncident.toLowerCase().includes(search)
              )
              ?.map((blotter, idx) => (
                <tr
                  ref={(el) => {
                    refs.current[blotter.id] = el;
                  }}
                  key={blotter.id}
                  className={cn(
                    "text-center text-sm hover:bg-zinc-50",
                    blotter.id === id && "bg-green-100"
                  )}
                >
                  <td className="border border-[#dddddd] p-2">{idx + 1}.</td>
                  <td className="border border-[#dddddd] p-2">
                    {blotter.user.fullName}
                  </td>
                  <td className="border border-[#dddddd] p-2">
                    {blotter.user.sitioPurok}
                  </td>
                  <td className="border border-[#dddddd] p-2">
                    {blotter.incident}
                  </td>
                  <td className="border border-[#dddddd] p-2">
                    {blotter.placeOfIncident}
                  </td>
                  <td className="border border-[#dddddd] p-2">
                    {blotter.witnesses.join(", ")}
                  </td>
                  <td className="border border-[#dddddd] p-2">
                    {new Date(blotter.createdAt).toLocaleDateString([], {
                      dateStyle: "medium",
                    })}
                  </td>
                  <td className="border border-[#dddddd] p-2">
                    <ReactToPrint value={blotter} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
