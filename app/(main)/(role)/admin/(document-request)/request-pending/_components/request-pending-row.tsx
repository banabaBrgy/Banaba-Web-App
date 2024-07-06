"use client";

import { approvedRequest } from "@/action/admin/request-pending";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { DocumentRequest } from "@prisma/client";
import React, {
  ElementRef,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { FaCheck } from "react-icons/fa";
import { MdOutlineSearch } from "react-icons/md";
import { toast } from "sonner";

interface RequestPendingRowProp {
  requestPending:
    | (DocumentRequest & {
        requestedBy: {
          fullName: string;
        };
      })[]
    | null;
  id: string;
}

export default function RequestPendingRow({
  requestPending,
  id,
}: RequestPendingRowProp) {
  const [pending, setTransition] = useTransition();
  const [search, setSearch] = useState("");
  const refs = useRef<{ [keys: string]: ElementRef<"tr"> | null }>({});

  const tableHead = [
    "No.",
    "Control no.",
    "Document type",
    "Requested by",
    "Date requested",
    "Purposes",
    "Option",
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

  function onApprovedRequest(documentRequestId: string) {
    setTransition(async () => {
      await approvedRequest(documentRequestId)
        .then(() => toast.success("Approved successfully"))
        .catch((error) => toast.error(error.message));
    });
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-lg uppercase">
          Document Requested - Pending
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
            {requestPending
              ?.filter(
                (requestPending) =>
                  requestPending.id.toLowerCase().includes(search) ||
                  requestPending.documentType.toLowerCase().includes(search) ||
                  requestPending.requestedBy.fullName
                    .toLowerCase()
                    .includes(search)
              )
              ?.map((requestPending, idx) => (
                <tr
                  key={requestPending.id}
                  ref={(el) => {
                    refs.current[requestPending.id] = el;
                  }}
                  className={cn(
                    "text-center text-sm hover:bg-zinc-50",
                    requestPending.id === id && "bg-green-100"
                  )}
                >
                  <td className="p-2 border border-[#dddddd]">{idx + 1}.</td>
                  <td className="p-2 border border-[#dddddd]">
                    {requestPending.id}
                  </td>
                  <td className="p-2 border border-[#dddddd]">
                    {requestPending.documentType}
                  </td>
                  <td className="p-2 border border-[#dddddd]">
                    {requestPending.requestedBy.fullName}
                  </td>
                  <td className="p-2 border border-[#dddddd]">
                    {new Date(requestPending.createdAt).toLocaleDateString([], {
                      dateStyle: "medium",
                    })}
                  </td>
                  <td className="p-2 border border-[#dddddd]">
                    {requestPending.purposes}
                  </td>
                  <td className="p-2 border border-[#dddddd]">
                    <Button
                      onClick={() => onApprovedRequest(requestPending.id)}
                      title="Approved"
                      size="sm"
                      variant="outline"
                      disabled={pending}
                      className="shadow-md text-green-500"
                    >
                      <FaCheck />
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
