"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { MdOutlineSearch } from "react-icons/md";
import { FaRegEye } from "react-icons/fa";

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

  const tableHead = [
    "No.",
    "Barangay/Purok/Sitio",
    "Incident",
    "Place of incident",
    "Date/Time",
    "View",
  ];

  return (
    <div className="mt-5 space-y-4">
      <div className="relative flex items-center ml-auto flex-1 max-w-[20rem]">
        <MdOutlineSearch className="absolute right-3 scale-[1.4] text-zinc-400" />
        <Input
          onChange={(e) => setSearch(e.target.value.toLowerCase())}
          type="text"
          placeholder="Search"
          className="pr-10"
        />
      </div>

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
                  <Button variant="outline" size="sm" className="shadow-md">
                    <FaRegEye className="scale-[1.3]" />
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
