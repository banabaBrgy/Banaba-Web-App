"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Blotter } from "@prisma/client";
import { X } from "lucide-react";
import React, { ElementRef, useEffect, useRef, useState } from "react";
import { GrFormView } from "react-icons/gr";
import { MdOutlineSearch } from "react-icons/md";
import "react-quill/dist/quill.snow.css";

interface BlotterRowProp {
  blotters:
    | (Blotter & { user: { fullName: string; sitioPurok: string | null } })[]
    | null;
  id: string;
}

export default function BlotterRow({ blotters, id }: BlotterRowProp) {
  const [search, setSearch] = useState("");
  const refs = useRef<{ [key: string]: ElementRef<"tr"> | null }>({});
  const [viewNarrative, setViewNarrative] = useState("");
  const viewNarrativeRef = useRef<ElementRef<"div">>(null);

  const tableHead = [
    "No.",
    "Narrator/Complainant",
    "Sitio/Purok",
    "Incidents",
    "Place of incidents",
    "Witnesses",
    "Date registered",
    "View narrative",
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

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!viewNarrativeRef.current?.contains(e.target as any)) {
        setViewNarrative("");
      }
    };

    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, []);

  useEffect(() => {
    if (viewNarrative) {
      document.body.style.overflow = "clip";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [viewNarrative]);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 bg-black/70 z-[1001] flex items-center px-3 py-8 overflow-auto duration-200",
          viewNarrative ? "opacity-100 visible" : "invisible opacity-0"
        )}
      >
        <div
          ref={viewNarrativeRef}
          className={cn(
            "relative flex-1 max-w-[40rem] p-5 bg-white rounded-md mx-auto my-auto",
            viewNarrative ? "scale-100 visible" : "invisible scale-95"
          )}
        >
          <X
            onClick={() => setViewNarrative("")}
            cursor="pointer"
            className="absolute right-3 top-2 text-zinc-500 scale-[.80]"
          />

          <div className="space-y-3">
            <h1 className="font-semibold text-xl">Narrative</h1>

            <div
              className="ql-editor"
              dangerouslySetInnerHTML={{ __html: viewNarrative }}
            />
          </div>
        </div>
      </div>

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
        <table className="w-full bg-white">
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
                    "hover:bg-zinc-50",
                    blotter.id === id && "bg-green-100"
                  )}
                >
                  <td className="text-center text-sm border border-[#dddddd] p-2">
                    {idx + 1}.
                  </td>
                  <td className="text-center text-sm border border-[#dddddd] p-2">
                    {blotter.user.fullName}
                  </td>
                  <td className="text-center text-sm border border-[#dddddd] p-2">
                    {blotter.user.sitioPurok}
                  </td>
                  <td className="text-center text-sm border border-[#dddddd] p-2">
                    {blotter.incident}
                  </td>
                  <td className="text-center text-sm border border-[#dddddd] p-2">
                    {blotter.placeOfIncident}
                  </td>
                  <td className="text-center text-sm border border-[#dddddd] p-2">
                    {blotter.witnesses.join(", ")}
                  </td>
                  <td className="text-center text-sm border border-[#dddddd] p-2">
                    {new Date(blotter.createdAt).toLocaleDateString([], {
                      dateStyle: "medium",
                    })}
                  </td>
                  <td className="text-center text-sm border border-[#dddddd] p-2">
                    <Button
                      title="Show narrative"
                      onClick={(e) => {
                        setViewNarrative(blotter.narrative);
                        e.stopPropagation();
                      }}
                      size="sm"
                      variant="outline"
                    >
                      <GrFormView className="scale-[2]" />
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
