"use client";

import {
  deleteAnnouncement,
  editAnnouncement,
} from "@/action/admin/announcement";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEdgeStore } from "@/lib/edgestore";
import { cn } from "@/lib/utils";
import { Announcement } from "@prisma/client";
import Image from "next/image";
import React, { useState, useTransition } from "react";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { MdEdit, MdOutlineSearch } from "react-icons/md";
import { toast } from "sonner";
import { IoIosSave } from "react-icons/io";
import TextareaAutoSize from "react-textarea-autosize";

interface AnnouncementRowProp {
  announcements: Announcement[] | null;
}

export default function AnnouncementRow({
  announcements,
}: AnnouncementRowProp) {
  const [pending, setTransition] = useTransition();
  const [edit, setEdit] = useState<Announcement | null>(null);
  const [del, setDelete] = useState<Announcement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const { edgestore } = useEdgeStore();
  const [search, setSearch] = useState("");

  const tableHead = ["No.", "About", "Photo", "Date Posted", "Option"];

  function onSaveEdit() {
    setTransition(async () => {
      let res;

      if (file) {
        res = await edgestore.publicFiles.upload({
          file,
          options: {
            replaceTargetUrl: edit?.photo,
          },
        });
      }

      const url = res?.url || edit?.photo;

      await editAnnouncement(edit?.id, edit?.about, url)
        .then(() => {
          toast.success("Edited successfully");
          setEdit(null);
          setFile(null);
        })
        .catch(() => toast.error("Something went wrong"));
    });
  }

  function onDeleteAnnouncement() {
    setTransition(async () => {
      await edgestore.publicFiles.delete({
        url: del?.photo as string,
      });

      await deleteAnnouncement(del?.id)
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
            <h1 className="font-semibold text-lg">Delete announcement</h1>
            <p className="text-sm text-gray-500">
              This action cannot be undone. This will permanentlty delete this
              announcement.
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
        <h1 className="text-lg font-semibold uppercase">Announcements</h1>

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
        <table className="bg-white w-full">
          <thead>
            <tr>
              {tableHead.map((th) => (
                <th
                  className="border border-green-500 bg-green-500 p-2 font-normal text-white whitespace-nowrap uppercase text-sm"
                  key={th}
                >
                  {th}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {announcements
              ?.filter((announcement) =>
                announcement.about.toLowerCase().includes(search)
              )
              ?.map((announcement, idx) => (
                <tr
                  key={announcement.id}
                  className="text-sm text-center hover:bg-zinc-50"
                >
                  <td className="border border-[#dddddd] p-2">{idx + 1}.</td>
                  <td className="border border-[#dddddd] p-2 min-w-[15rem]">
                    {edit?.id === announcement.id ? (
                      <TextareaAutoSize
                        onChange={({ target: { value } }) =>
                          setEdit(
                            (prev) =>
                              ({ ...prev, about: value } as Announcement)
                          )
                        }
                        defaultValue={announcement.about}
                        className="border border-zinc-300 rounded-md p-1 w-full outline-none focus:ring-2 ring-zinc-400 ring-offset-2"
                      />
                    ) : (
                      announcement.about
                    )}
                  </td>
                  <td className="space-y-2 border border-[#dddddd] p-2">
                    {edit?.id === announcement.id && (
                      <Input
                        type="file"
                        onChange={(e) => setFile(e.target.files?.[0] as File)}
                      />
                    )}
                    <Image
                      src={announcement.photo}
                      alt={announcement.about}
                      width={500}
                      height={500}
                      priority
                      className="w-auto h-auto max-w-[35rem] mx-auto"
                    />
                  </td>
                  <td className="border border-[#dddddd] p-2">
                    {new Date(announcement.createdAt).toLocaleDateString([], {
                      dateStyle: "medium",
                    })}
                  </td>
                  <td className="space-x-1 space-y-1 border border-[#dddddd] min-w-[10rem] p-2">
                    <Button
                      onClick={() => {
                        setEdit((prev) =>
                          prev?.id === announcement.id ? null : announcement
                        );
                        setFile(null);
                      }}
                      size="sm"
                      variant="outline"
                      title="Edit"
                      className="shadow-md"
                    >
                      <MdEdit className="scale-[1.3]" />
                    </Button>
                    <Button
                      onClick={onSaveEdit}
                      disabled={
                        pending ||
                        edit?.id !== announcement.id ||
                        (edit.about === announcement.about && !file)
                      }
                      size="sm"
                      variant="outline"
                      title="Save"
                      className="shadow-md"
                    >
                      <IoIosSave className="scale-[1.3]" />
                    </Button>
                    <Button
                      onClick={() => setDelete(announcement)}
                      size="sm"
                      variant="outline"
                      title="Delete"
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
    </>
  );
}
