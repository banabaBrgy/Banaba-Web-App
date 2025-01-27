"use client";

import { deletePendingRequest } from "@/action/user/my-request";
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
import { MdOutlineSearch } from "react-icons/md";
import { RiDeleteBinFill } from "react-icons/ri";
import { toast } from "sonner";

interface MyRequestRowProp {
  myRequest:
    | (DocumentRequest & { issuedBy: { fullName: string } | null })[]
    | null;
  id: string;
}

export default function MyRequestRow({ myRequest, id }: MyRequestRowProp) {
  const [pending, setTransition] = useTransition();
  const [search, setSearch] = useState("");
  const refs = useRef<{ [key: string]: ElementRef<"tr"> | null }>({});

  const tableHead = [
    "No.",
    "Control No.",
    "Document Type",
    "Date Requested",
    "Purposes",
    "Issued by",
    "Date issued",
    "Status",
    "Option",
  ];

  useEffect(() => {
    if (id && refs.current[id]) {
      refs?.current[id]?.scrollIntoView({
        block: "center",
        inline: "center",
        behavior: "smooth",
      });
    }
  }, [id]);

  const onDeletePendingRequest = async (id: string) => {
    setTransition(async () => {
      await deletePendingRequest(id)
        .then(() => toast.success("Deleted successfully"))
        .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <div className="px-4 py-4">
      <div className="flex items-center justify-between">
        <h1 className="sm:text-lg text-sm font-semibold uppercase">
          My Request
        </h1>

        <div className="relative flex items-center flex-1 sm:max-w-[20rem] max-w-[13rem]">
          <MdOutlineSearch className="absolute right-3 scale-[1.4] text-zinc-400" />
          <Input
            onChange={async (e) => setSearch(e.target.value)}
            type="text"
            placeholder="Search"
            className="pr-10"
          />
        </div>
      </div>

      <div className="overflow-auto mt-4">
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
                <tr
                  key={item.id}
                  ref={(el) => {
                    refs.current[item.id] = el;
                  }}
                  className={cn("text-sm", item.id === id && "bg-green-100")}
                >
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
                      item.status === "Approved" && "text-green-500",
                      item.status === "Disapproved" && "text-yellow-500"
                    )}
                  >
                    {item.status}
                  </td>
                  <td className="border border-zinc-300 p-2 text-center">
                    {item.status === "Pending" && (
                      <Button
                        disabled={pending}
                        onClick={() => onDeletePendingRequest(item.id)}
                        size="sm"
                        variant="outline"
                        className="shadow"
                      >
                        <RiDeleteBinFill color="red" />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
