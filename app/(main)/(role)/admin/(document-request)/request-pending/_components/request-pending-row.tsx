"use client";

import {
  approvedRequest,
  disapprovedRequestAction,
} from "@/action/admin/request-pending";
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
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import { MdOutlineSearch } from "react-icons/md";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

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
  const [disapprovedRequest, setDisapprovedRequest] = useState<
    (DocumentRequest & { requestedBy: { fullName: string } }) | null
  >(null);
  const disapprovedFormRef = useRef<ElementRef<"form">>(null);

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
        .catch(() => toast.error("Something went wrong"));
    });
  }

  function onDisapprovedRequest(formData: FormData) {
    setTransition(async () => {
      await disapprovedRequestAction(disapprovedRequest?.id, formData)
        .then(() => {
          toast.success("Disapproved request");
          setDisapprovedRequest(null);
          disapprovedFormRef.current?.reset();
        })
        .catch(() => toast.error("Something went wrong"));
    });
  }

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 flex items-center justify-center bg-black/80 z-[1001] duration-200",
          disapprovedRequest?.id ? "visible opacity-100" : "invisible opacity-0"
        )}
      >
        <form
          action={onDisapprovedRequest}
          key={disapprovedRequest?.id}
          ref={disapprovedFormRef}
          className={cn(
            "bg-white p-5 rounded-md duration-200 min-w-[32rem] max-w-[32rem]",
            disapprovedRequest?.id ? "scale-100 visible" : "scale-95 invisible"
          )}
        >
          <div className="mb-6">
            <h1 className="text-xl font-bold mb-3">Disapproved request?</h1>

            <p>
              Are you sure you want to disapproved{" "}
              <strong>
                {disapprovedRequest?.requestedBy.fullName}{" "}
                {disapprovedRequest?.documentType}
              </strong>{" "}
              request?
            </p>

            <Textarea
              rows={5}
              className="mt-3 border border-zinc-300"
              name="reasonForDisapproval"
              required
              autoFocus
              placeholder="Please provide the reason for disapproving this request..."
            />
          </div>

          <div className="flex items-center justify-end gap-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDisapprovedRequest(null)}
            >
              Cancel
            </Button>
            <Button type="submit">Continue</Button>
          </div>
        </form>
      </div>

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
        <table className="border-collapse bg-white w-full">
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
                  <td className="p-2 border border-[#dddddd] min-w-36 space-x-1">
                    <Button
                      onClick={() => onApprovedRequest(requestPending.id)}
                      title="Approved"
                      size="sm"
                      variant="outline"
                      disabled={pending}
                      className="shadow-md text-green-500"
                    >
                      <AiFillLike />
                    </Button>
                    <Button
                      onClick={() => setDisapprovedRequest(requestPending)}
                      title="Disapproved"
                      size="sm"
                      variant="outline"
                      disabled={pending}
                      className="shadow-md text-yellow-500"
                    >
                      <AiFillDislike />
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
