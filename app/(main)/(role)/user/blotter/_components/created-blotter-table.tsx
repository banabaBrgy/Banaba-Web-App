"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { ElementRef, useEffect, useRef, useState } from "react";
import { MdOutlineSearch } from "react-icons/md";
import { GrFormView } from "react-icons/gr";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface CreatedBlotterTableProp {
  createdBlotters:
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
          sitioPurok: string | null;
        };
      }[]
    | null;
}

export default function CreatedBlotterTable({
  createdBlotters,
}: CreatedBlotterTableProp) {
  const [search, setSearch] = useState("");
  const [viewNarrative, setViewNarrative] = useState("");
  const viewNarrativeRef = useRef<ElementRef<"div">>(null);

  const tableHead = [
    "No.",
    "Barangay/Purok/Sitio",
    "Incident",
    "Place of incident",
    "Date/Time",
    "Narrative",
  ];

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

            <div dangerouslySetInnerHTML={{ __html: viewNarrative }} />
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="sm:text-lg text-sm font-semibold uppercase">
            My Blotters
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
          <table className="border-collapse w-full bg-white">
            <thead>
              <tr>
                {tableHead.map((th, idx) => (
                  <th
                    key={idx}
                    className="bg-green-500 border border-green-500 text-white p-2 font-normal whitespace-nowrap text-sm"
                  >
                    {th}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {createdBlotters
                ?.filter(
                  (blotter) =>
                    blotter.user.sitioPurok?.toLowerCase().includes(search) ||
                    blotter.incident.toLowerCase().includes(search)
                )
                ?.map((blotter, idx) => (
                  <tr key={blotter.id} className="text-sm">
                    <td className="p-2 border border-zinc-300 text-center">
                      {idx + 1}.
                    </td>
                    <td className="p-2 border border-zinc-300 text-center">
                      {blotter.user.sitioPurok}
                    </td>
                    <td className="p-2 border border-zinc-300 text-center">
                      {blotter.incident}
                    </td>
                    <td className="p-2 border border-zinc-300 text-center">
                      {blotter.placeOfIncident}
                    </td>
                    <td className="p-2 border border-zinc-300 text-center">
                      {new Date(blotter.dateTime).toLocaleDateString([], {
                        dateStyle: "medium",
                      })}
                    </td>
                    <td className="p-2 border border-zinc-300 text-center">
                      <Button
                        onClick={(e) => {
                          setViewNarrative(blotter.narrative);
                          e.stopPropagation();
                        }}
                        variant="outline"
                        size="sm"
                        className="shadow-md"
                      >
                        <GrFormView className="scale-[2]" />
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
