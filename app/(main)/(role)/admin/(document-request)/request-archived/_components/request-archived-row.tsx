"use client";

import { unArchivedRequest } from "@/action/admin/request-archived";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { DocumentRequest } from "@prisma/client";
import { useState, useTransition } from "react";
import { MdOutlineSearch } from "react-icons/md";
import { RiInboxUnarchiveFill } from "react-icons/ri";
import { toast } from "sonner";

interface RequestArchivedRowProp {
  requestArchiveds: (DocumentRequest & { requestedBy: { fullName: string } })[];
}

export const RequestArchivedRow = ({
  requestArchiveds,
}: RequestArchivedRowProp) => {
  const [pending, setTransition] = useTransition();
  const [search, setSearch] = useState("");

  const tableHead = [
    "No.",
    "Control no.",
    "Document type",
    "Requested by",
    "Date requested",
    "Purposes",
    "Status",
    "Option",
  ];

  const dateTimeFormatter = Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  });

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-semibold text-lg uppercase">
          Document Requested - Archived
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

      <div className="oveflow-auto">
        <table className="w-full bg-white">
          <thead>
            <tr>
              {tableHead.map((th) => (
                <th
                  key={th}
                  className="border border-green-500 bg-green-500 p-2 text-white font-normal whitespace-nowrap text-sm uppercase"
                >
                  {th}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {requestArchiveds?.map((requestArchived, idx) => (
              <tr
                key={requestArchived.id}
                className="text-center text-sm hover:bg-zinc-50"
              >
                <td className="p-2 border border-[#dddddd]">{idx + 1}</td>
                <td className="p-2 border border-[#dddddd]">
                  {requestArchived.id}
                </td>
                <td className="p-2 border border-[#dddddd]">
                  {requestArchived.documentType}
                </td>
                <td className="p-2 border border-[#dddddd]">
                  {requestArchived.requestedBy.fullName}
                </td>
                <td className="p-2 border border-[#dddddd]">
                  {dateTimeFormatter.format(requestArchived.createdAt)}
                </td>
                <td className="p-2 border border-[#dddddd]">
                  {requestArchived.purposes}
                </td>
                <td
                  className={cn(
                    "p-2 border border-[#dddddd]",
                    requestArchived.status === "Approved"
                      ? "text-green-500"
                      : "text-yellow-500"
                  )}
                >
                  {requestArchived.status}
                </td>
                <td className="p-2 border border-[#dddddd]">
                  <Button
                    onClick={() =>
                      setTransition(async () => {
                        await unArchivedRequest(requestArchived.id)
                          .then(() => {
                            toast.success("Unarchived successfully");
                          })
                          .catch(() => toast.error("Something went wrong"));
                      })
                    }
                    disabled={pending}
                    title="Unarchived"
                    size="sm"
                    variant="outline"
                    className="shadow-md text-yellow-500"
                  >
                    <RiInboxUnarchiveFill className="scale-[1.2]" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
