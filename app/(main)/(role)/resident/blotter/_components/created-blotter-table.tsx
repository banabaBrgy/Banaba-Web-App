"use client";

import ReactToPrint from "@/components/react-to-print";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { MdOutlineSearch } from "react-icons/md";

interface CreatedBlotterTableProp {
  createdBlotters:
    | {
        id: string;
        userId: string;
        barangayPurokSitio: string;
        incident: string;
        placeOfIncident: string;
        dateTime: string;
        witnesses: string[];
        narrative: string;
        createdAt: Date;
        updatedAt: Date;
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
    "Option",
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
                className="bg-green-500 border border-green-500 text-white p-2 font-medium whitespace-nowrap"
              >
                {th}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {createdBlotters
            ?.filter(
              (i) =>
                i.barangayPurokSitio.toLowerCase().includes(search) ||
                i.incident.toLowerCase().includes(search)
            )
            ?.map((blotter, idx) => (
              <tr key={blotter.id}>
                <td className="p-2 border border-zinc-300 text-center">
                  {idx + 1}
                </td>
                <td className="p-2 border border-zinc-300 text-center">
                  {blotter.barangayPurokSitio}
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
                  <ReactToPrint value={blotter} />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
