"use client";

import { archieveRequest } from "@/action/admin/request-approved";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { DocumentRequest } from "@prisma/client";
import React, { useState, useTransition } from "react";
import { MdOutlineSearch } from "react-icons/md";
import { HiArchive } from "react-icons/hi";
import { toast } from "sonner";

interface RequestApprovedRowProp {
  requestApproved:
    | (DocumentRequest & {
        requestedBy: { fullName: string };
        issuedBy: { fullName: string } | null;
      })[]
    | null;
}

export default function RequestApprovedRow({
  requestApproved,
}: RequestApprovedRowProp) {
  const [pending, setTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [archiveApprovedRequest, setArchiveApprovedRequest] = useState<
    | (DocumentRequest & {
        requestedBy: { fullName: string };
        issuedBy: { fullName: string } | null;
      })
    | null
  >(null);

  const tableHead = [
    "No.",
    "Control no.",
    "Document type",
    "Requested by",
    "Date requested",
    "Issued by",
    "Date issued",
    "Purposes",
    "Option",
  ];

  function onArchiveApprovedRequest() {
    setTransition(async () => {
      archieveRequest(archiveApprovedRequest?.id)
        .then(() => {
          toast.success("Archived successfully");
          setArchiveApprovedRequest(null);
        })
        .catch(() => toast.error("Something went wrong"));
    });
  }

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 flex items-center justify-center bg-black/80 z-[1001] duration-200",
          archiveApprovedRequest?.id
            ? "visible opacity-100"
            : "invisible opacity-0"
        )}
      >
        <div
          className={cn(
            "bg-white p-5 rounded-md duration-200 min-w-[32rem] max-w-[32rem]",
            archiveApprovedRequest?.id
              ? "scale-100 opacity-100"
              : "scale-95 opacity-0"
          )}
        >
          <div className="mb-6">
            <h1 className="text-xl font-bold mb-3">
              Archive approved request?
            </h1>

            <p>
              Are you sure you want to archive{" "}
              <strong>
                {archiveApprovedRequest?.requestedBy.fullName}{" "}
                {archiveApprovedRequest?.documentType}
              </strong>{" "}
              approved request?
            </p>
          </div>

          <div className="flex items-center justify-end gap-x-2">
            <Button
              onClick={() => setArchiveApprovedRequest(null)}
              type="button"
              variant="outline"
              disabled={pending}
            >
              Cancel
            </Button>
            <Button
              onClick={onArchiveApprovedRequest}
              disabled={pending}
              type="submit"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>

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
                  <td className="p-2 border border-[#dddddd]">
                    <Button
                      onClick={() => setArchiveApprovedRequest(requestApproved)}
                      title="Archive"
                      size="sm"
                      variant="outline"
                      className="shadow-md text-yellow-500"
                      disabled={pending}
                    >
                      <HiArchive className="scale-[1.2]" />
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
