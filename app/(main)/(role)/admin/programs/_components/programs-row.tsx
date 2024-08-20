"use client";

import { deletePrograms, editProgram } from "@/action/admin/programs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEdgeStore } from "@/lib/edgestore";
import { cn } from "@/lib/utils";
import { Programs } from "@prisma/client";
import Image from "next/image";
import React, { useState, useTransition } from "react";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { MdEdit, MdOutlineSearch } from "react-icons/md";
import { toast } from "sonner";
import { IoIosSave } from "react-icons/io";
import TextareaAutoSize from "react-textarea-autosize";

interface ProgramsRowProp {
  programs: Programs[] | null;
}

export default function ProgramsRow({ programs }: ProgramsRowProp) {
  const [pending, setTransition] = useTransition();
  const [edit, setEdit] = useState<Programs | null>(null);
  const [del, setDelete] = useState<Programs | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const { edgestore } = useEdgeStore();
  const [search, setSearch] = useState("");

  const tableHead = ["No.", "About", "Photo", "Date Posted", "Option"];

  function onSaveEdit() {
    try {
      setTransition(async () => {
        let res;

        if (file) {
          res = await edgestore.publicFiles.upload({
            file,
            options: {
              replaceTargetUrl: edit?.photo as string,
            },
          });
        }

        const url = res?.url || edit?.photo;

        await editProgram(edit?.id, edit?.about, url)
          .then(() => {
            toast.success("Edited successfully");
            setEdit(null);
            setFile(null);
          })
          .catch(() => toast.error("Something went wrong"));
      });
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  function onDeleteAnnouncement() {
    setTransition(async () => {
      await edgestore.publicFiles.delete({
        url: del?.photo as string,
      });

      await deletePrograms(del?.id)
        .then(() => {
          toast.success("Deleted successfully");
          setDelete(null);
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
            <h1 className="font-semibold text-lg">Delete program</h1>
            <p className="text-sm text-gray-500">
              This action cannot be undone. This will permanentlty delete this
              program.
            </p>
          </div>

          <div className="flex md:flex-row flex-col justify-end gap-2">
            <Button onClick={() => setDelete(null)} variant="outline">
              Cancel
            </Button>
            <Button onClick={onDeleteAnnouncement} disabled={pending}>
              Continue
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-lg uppercase">Programs</h1>

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

      <div className="overflow-auto">
        <table className="border-collapse w-full bg-white">
          <thead>
            <tr>
              {tableHead.map((th, idx) => (
                <th
                  key={idx}
                  className="bg-green-500 border border-green-500 p-2 font-normal text-white whitespace-nowrap uppercase text-sm"
                >
                  {th}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {programs
              ?.filter((program) =>
                program.about.toLowerCase().includes(search)
              )
              ?.map((program, idx) => (
                <tr
                  key={program.id}
                  className="text-center text-sm hover:bg-zinc-50"
                >
                  <td className="p-2 border border-[#dddddd]">{idx + 1}.</td>
                  <td className="p-2 border border-[#dddddd] min-w-[15rem]">
                    {edit?.id === program.id ? (
                      <TextareaAutoSize
                        defaultValue={program.about}
                        onChange={({ target: { value } }) =>
                          setEdit(
                            (prev) => ({ ...prev, about: value } as Programs)
                          )
                        }
                        className="border border-zinc-300 rounded-md p-1 w-full outline-none focus:ring-2 ring-zinc-400 ring-offset-2"
                      />
                    ) : (
                      program.about
                    )}
                  </td>
                  <td className="space-y-2 p-2 border border-[#dddddd]">
                    {edit?.id === program.id && (
                      <Input
                        type="file"
                        onChange={(e) => setFile(e.target.files?.[0] as any)}
                      />
                    )}
                    <Image
                      src={program.photo}
                      alt={program.about}
                      width={500}
                      height={500}
                      priority
                      className="w-auto h-auto max-w-[35rem] mx-auto"
                    />
                  </td>
                  <td className="p-2 border border-[#dddddd]">
                    {new Date(program.createdAt).toLocaleDateString([], {
                      dateStyle: "medium",
                    })}
                  </td>
                  <td className="space-x-1 space-y-1 p-2 w-40 border border-[#dddddd] min-w-[10rem]">
                    <Button
                      onClick={() => {
                        setEdit((prev) =>
                          prev?.id === program.id ? null : program
                        );
                        setFile(null);
                      }}
                      size="sm"
                      variant="outline"
                      className="shadow-md"
                      title="Edit"
                    >
                      <MdEdit className="scale-[1.3]" />
                    </Button>
                    <Button
                      onClick={onSaveEdit}
                      disabled={
                        pending ||
                        edit?.id !== program.id ||
                        (edit.about === program.about && !file)
                      }
                      size="sm"
                      variant="outline"
                      className="shadow-md"
                      title="Save"
                    >
                      <IoIosSave className="scale-[1.3]" />
                    </Button>
                    <Button
                      onClick={() => setDelete(program)}
                      size="sm"
                      variant="outline"
                      className="shadow-md"
                      title="Delete"
                    >
                      <RiDeleteBin6Fill className="scale-[1.3] text-red-500" />
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
