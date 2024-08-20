"use client";

import React, { ElementRef, useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MdOutlineSearch } from "react-icons/md";
import { createDocument, deleteDocument } from "@/action/admin/document-type";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { DocumentType } from "@prisma/client";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { cn } from "@/lib/utils";

type DocumentTypeRowProp = {
  documentTypes: DocumentType[] | undefined;
};

export default function DocumentTypeRow({
  documentTypes,
}: DocumentTypeRowProp) {
  const [pending, setTransition] = useTransition();
  const [search, setSearch] = useState("");
  const formRef = useRef<ElementRef<"form">>(null);
  const [del, setDelete] = useState("");

  const tableHead = ["No", "Document type", "Option"];

  function onCreateDocument(formData: FormData) {
    setTransition(async () => {
      await createDocument(formData)
        .then((data) => {
          if (data?.error) {
            return toast.error(data.error);
          }
          toast.success("Created successfully");
          formRef.current?.reset();
        })
        .catch(() => toast.error("Something went wrong"));
    });
  }

  function onDeleteDocument() {
    setTransition(async () => {
      await deleteDocument(del)
        .then(() => {
          toast.success("Deleted successfully");
          setDelete("");
        })
        .catch(() => toast.error("Something went wrong"));
    });
  }

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 bg-black/80 flex items-center justify-center z-[1002] duration-100",
          del ? "opacity-100 visible" : "opacity-0 invisible"
        )}
      >
        <div
          className={cn(
            "space-y-4 bg-white p-7 md:rounded-lg max-w-[31rem] duration-200",
            del ? "scale-100 visible" : "scale-95 invisible"
          )}
        >
          <div className="space-y-3">
            <h1 className="font-semibold text-lg">Delete Document</h1>
            <p className="text-sm text-gray-500">
              This action cannot be undone. This will permanentlty delete this
              document.
            </p>
          </div>

          <div className="flex md:flex-row flex-col justify-end gap-2">
            <Button onClick={() => setDelete("")} variant="outline">
              Cancel
            </Button>
            <Button onClick={onDeleteDocument} disabled={pending}>
              Continue
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h1 className="text-lg font-semibold uppercase">Create document</h1>

        <form ref={formRef} action={onCreateDocument} className="space-y-2">
          <div className="space-y-2">
            <label htmlFor="document" className="text-sm">
              Document
            </label>
            <Input
              type="text"
              placeholder="Enter document"
              id="document"
              name="document"
              required
            />
          </div>

          <Button
            disabled={pending}
            className="w-full uppercase text-xs bg-green-500 hover:bg-green-500/80"
          >
            {pending ? <Loader2 className="animate-spin" /> : "Create"}
          </Button>
        </form>
      </div>
      <div className="space-y-4 mt-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold uppercase">Document Type</h1>

          <div className="relative flex items-center flex-1 max-w-[20rem]">
            <MdOutlineSearch className="absolute right-3 scale-[1.4] text-zinc-400" />
            <Input
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search"
              className="pr-10"
            />
          </div>
        </div>

        <div className="overflow-auto" id="document-type">
          <table className="border-collapse w-full bg-white">
            <thead>
              <tr>
                {tableHead.map((th, idx) => (
                  <th
                    key={idx}
                    className="border border-green-500 bg-green-500 p-2 font-normal text-white uppercase text-sm"
                  >
                    {th}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {documentTypes
                ?.filter((documentType) =>
                  documentType.document.toLowerCase().includes(search)
                )
                ?.map((documentType, idx) => (
                  <tr
                    key={documentType.id}
                    className="text-center text-sm hover:bg-zinc-50"
                  >
                    <td className="p-2 border border-[#dddddd]">{idx + 1}.</td>
                    <td className="p-2 border border-[#dddddd]">
                      {documentType.document}
                    </td>
                    <td className="p-2 border border-[#dddddd]">
                      <Button
                        onClick={() => setDelete(documentType.id)}
                        size="sm"
                        variant="outline"
                        className="shadow-md"
                      >
                        <RiDeleteBin6Fill className="scale-[1.3] text-red-500" />
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
