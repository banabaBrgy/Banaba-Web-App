"use client";

import { archieveRequest } from "@/action/admin/request-approved";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { DocumentRequest } from "@prisma/client";
import React, { useState, useTransition } from "react";
import { HiArchive } from "react-icons/hi";
import { MdOutlineSearch } from "react-icons/md";
import { toast } from "sonner";

interface RequestDisapprovedRowProp {
  disapprovedRequests: (DocumentRequest & {
    requestedBy: { fullName: string };
  })[];
}

export function RequestDisapprovedRow({
  disapprovedRequests,
}: RequestDisapprovedRowProp) {
  const [pending, setTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [archiveDisapprovedRequest, setArchiveDisapprovedRequest] = useState<
    (DocumentRequest & { requestedBy: { fullName: string } }) | null
  >(null);

  const tableHead = [
    "No.",
    "Control no.",
    "Document type",
    "Requested by",
    "Date requested",
    "Purposes",
    "Option",
  ];

  const dateTimeFormatter = Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  });

  function onArchiveDisapprovedRequest() {
    setTransition(async () => {
      await archieveRequest(archiveDisapprovedRequest?.id)
        .then(() => {
          toast.success("Archived successfully");
          setArchiveDisapprovedRequest(null);
        })
        .catch(() => toast.error("Something went wrong"));
    });
  }

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 flex items-center justify-center bg-black/80 z-[1001] duration-200",
          archiveDisapprovedRequest?.id
            ? "visible opacity-100"
            : "invisible opacity-0"
        )}
      >
        <div
          className={cn(
            "bg-white p-5 rounded-md duration-200 min-w-[32rem] max-w-[32rem]",
            archiveDisapprovedRequest?.id
              ? "scale-100 opacity-100"
              : "scale-95 opacity-0"
          )}
        >
          <div className="mb-6">
            <h1 className="text-xl font-bold mb-3">
              Archive diapproved request?
            </h1>

            <p>
              Are you sure you want to archive{" "}
              <strong>
                {archiveDisapprovedRequest?.requestedBy.fullName}{" "}
                {archiveDisapprovedRequest?.documentType}
              </strong>{" "}
              disapproved request?
            </p>
          </div>

          <div className="flex items-center justify-end gap-x-2">
            <Button
              onClick={() => setArchiveDisapprovedRequest(null)}
              type="button"
              variant="outline"
              disabled={pending}
            >
              Cancel
            </Button>
            <Button
              onClick={onArchiveDisapprovedRequest}
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
        <table className="w-full bg-white">
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
            {disapprovedRequests
              ?.filter(
                (item) =>
                  item.id.includes(search) ||
                  item.documentType.toLowerCase().includes(search) ||
                  item.requestedBy.fullName.toLowerCase().includes(search) ||
                  item.purposes.toLowerCase().includes(search)
              )
              ?.map((disapprovedRequest, idx) => (
                <tr key={disapprovedRequest.id} className="text-center text-sm">
                  <td className="border border-[#dddddd] p-2">{idx + 1}</td>
                  <td className="border border-[#dddddd] p-2">
                    {disapprovedRequest.id}
                  </td>
                  <td className="border border-[#dddddd] p-2">
                    {disapprovedRequest.documentType}
                  </td>
                  <td className="border border-[#dddddd] p-2">
                    {disapprovedRequest.requestedBy.fullName}
                  </td>
                  <td className="border border-[#dddddd] p-2">
                    {dateTimeFormatter.format(disapprovedRequest.createdAt)}
                  </td>
                  <td className="border border-[#dddddd] p-2">
                    {disapprovedRequest.purposes}
                  </td>
                  <td className="p-2 border border-[#dddddd]">
                    <Button
                      onClick={() =>
                        setArchiveDisapprovedRequest(disapprovedRequest)
                      }
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
