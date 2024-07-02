"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { $Enums } from "@prisma/client";
import React, { useState } from "react";
import { MdOutlineSearch } from "react-icons/md";

interface MyRequestRowProp {
  myRequest:
    | {
        id: string;
        documentType: string;
        requestedById: string;
        purposes: string;
        issuedById: string | null;
        dateIssued: Date | null;
        status: $Enums.DocumentRequestStatus;
        createdAt: Date;
        updatedAt: Date;
        issuedBy: {
          fullName: string;
        } | null;
      }[]
    | null;
}

export default function MyRequestRow({ myRequest }: MyRequestRowProp) {
  const [search, setSearch] = useState("");

  const tableHead = [
    "No.",
    "Control No.",
    "Document Type",
    "Date Requested",
    "Purposes",
    "Issued by",
    "Date issued",
    "Status",
  ];

  return (
    <div className="px-4 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold uppercase">My Request</h1>

        <div className="relative flex items-center flex-1 max-w-[20rem]">
          <MdOutlineSearch className="absolute right-3 scale-[1.4] text-zinc-400" />
          <Input
            onChange={async (e) => setSearch(e.target.value)}
            type="text"
            placeholder="Search"
            className="pr-10"
          />
        </div>
      </div>

      <div className="overflow-auto  mt-4">
        <table className="border-collapse w-full bg-white">
          <thead>
            <tr>
              {tableHead.map((th) => (
                <th
                  className="bg-green-500 border border-green-500 font-normal text-white p-2 whitespace-nowrap text-sm"
                  key={th}
                >
                  {th}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {myRequest
              ?.filter(
                (r) =>
                  r.purposes.toLowerCase().includes(search) ||
                  r.documentType.toLowerCase().includes(search) ||
                  r.id.toLowerCase().includes(search)
              )
              ?.map((item, idx) => (
                <tr key={item.id} className="text-sm">
                  <td className="border border-zinc-300 p-2 text-center">
                    {idx + 1}
                  </td>
                  <td className="border border-zinc-300 p-2 text-center">
                    {item.id}
                  </td>
                  <td className="border border-zinc-300 p-2 text-center">
                    {item.documentType}
                  </td>

                  <td className="border border-zinc-300 p-2 text-center">
                    {new Date(item.createdAt).toLocaleDateString([], {
                      dateStyle: "medium",
                    })}
                  </td>
                  <td className="border border-zinc-300 p-2 text-center">
                    {item.purposes}
                  </td>
                  <td className="border border-zinc-300 p-2 text-center">
                    {item.issuedBy?.fullName}
                  </td>
                  <td className="border border-zinc-300 p-2 text-center">
                    {item.dateIssued &&
                      new Date(item.dateIssued).toLocaleDateString([], {
                        dateStyle: "medium",
                      })}
                  </td>
                  <td
                    className={cn(
                      "border border-zinc-300 p-2 text-red-500 text-center uppercase",
                      item.status === "Approved" && "text-green-500"
                    )}
                  >
                    {item.status}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
