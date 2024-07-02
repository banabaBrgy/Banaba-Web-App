"use client";

import { Input } from "@/components/ui/input";
import { $Enums } from "@prisma/client";
import React, { useState } from "react";
import { MdOutlineSearch } from "react-icons/md";

interface RequestApprovedRowProp {
  requestApproved:
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
        requestedBy: {
          fullName: string;
        };
        issuedBy: { fullName: string } | null;
      }[]
    | null;
}

export default function RequestApprovedRow({
  requestApproved,
}: RequestApprovedRowProp) {
  const [search, setSearch] = useState("");

  const tableHead = [
    "No.",
    "Control no.",
    "Document type",
    "Requested by",
    "Date requested",
    "Issued by",
    "Date issued",
    "Purposes",
  ];

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-lg uppercase">
          Document Requested - Approved
        </h1>

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
        <table className="bg-white w-full">
          <thead>
            <tr>
              {tableHead.map((th, idx) => (
                <th
                  key={idx}
                  className="border border-green-500 bg-green-500 p-2 text-white font-normal whitespace-nowrap text-sm uppercase"
                >
                  {th}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {requestApproved
              ?.filter(
                (requestApproved) =>
                  requestApproved.id.toLowerCase().includes(search) ||
                  requestApproved.documentType.toLowerCase().includes(search) ||
                  requestApproved.requestedBy.fullName
                    .toLowerCase()
                    .includes(search) ||
                  requestApproved.issuedBy?.fullName
                    .toLowerCase()
                    .includes(search)
              )
              ?.map((requestApproved, idx) => (
                <tr
                  key={requestApproved.id}
                  className="text-center text-sm hover:bg-zinc-50"
                >
                  <td className="p-2 border border-[#dddddd]">{idx + 1}.</td>
                  <td className="p-2 border border-[#dddddd]">
                    {requestApproved.id}
                  </td>
                  <td className="p-2 border border-[#dddddd]">
                    {requestApproved.documentType}
                  </td>
                  <td className="p-2 border border-[#dddddd]">
                    {requestApproved.requestedBy.fullName}
                  </td>
                  <td className="p-2 border border-[#dddddd]">
                    {new Date(requestApproved.createdAt).toLocaleDateString(
                      [],
                      {
                        dateStyle: "medium",
                      }
                    )}
                  </td>
                  <td className="p-2 border border-[#dddddd]">
                    {requestApproved.issuedBy?.fullName}
                  </td>
                  <td className="p-2 border border-[#dddddd]">
                    {requestApproved.dateIssued &&
                      new Date(requestApproved.dateIssued).toLocaleDateString(
                        [],
                        {
                          dateStyle: "medium",
                        }
                      )}
                  </td>
                  <td className="p-2 border border-[#dddddd]">
                    {requestApproved.purposes}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
