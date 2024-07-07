"use client";

import {
  addFolders,
  deleteFolder,
  deleteSelectedFolder,
  renameFolder,
} from "@/action/admin/files";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Files, Folders } from "@prisma/client";
import React, {
  ElementRef,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { FiPlus } from "react-icons/fi";
import { HiDotsVertical } from "react-icons/hi";
import { IoFolderSharp } from "react-icons/io5";
import { toast } from "sonner";
import { MdModeEditOutline, MdOutlineSearch } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { filesize } from "filesize";
import { useEdgeStore } from "@/lib/edgestore";

type FoldersType =
  | (Folders & { files: Files[] } & { selected?: boolean })[]
  | undefined;

type FolderRowProp = {
  folders: FoldersType;
};

export function FolderRow({ folders }: FolderRowProp) {
  const [pending, setTransition] = useTransition();
  const [foldersState, setFoldersState] = useState(folders);
  const [openPopover, setOpenPopover] = useState("");
  const [isOpenDeleteSelectedll, setOpenDeleteSelectedAll] = useState(false);
  const [edit, setEdit] = useState<Folders | null>(null);
  const [del, setDelete] = useState<Folders | null>(null);
  const checkboxRef = useRef<ElementRef<"input">>(null);
  const [search, setSearch] = useState("");
  const [addFolder, setAddFolder] = useState(false);
  const { edgestore } = useEdgeStore();

  useEffect(() => {
    setFoldersState(folders);
  }, [folders]);

  const tableHead = ["Name", "Date created", "Last modified", "Folder size"];

  const dateFormat = Intl.DateTimeFormat("en-us", {
    dateStyle: "medium",
  });

  const isSelectedAll = foldersState?.every(
    (fol) => fol.selected && fol.selected === true
  );

  const selectedFolders = foldersState?.filter(
    (fol) => fol.selected && fol.selected === true
  );

  function onSelectAll() {
    if (isSelectedAll) {
      setFoldersState((prev) =>
        prev?.map((fol) => ({ ...fol, selected: false }))
      );
    } else {
      setFoldersState((prev) =>
        prev?.map((fol) =>
          fol.selected !== true ? { ...fol, selected: true } : fol
        )
      );
    }
  }

  function onSelect(folderId: string) {
    setFoldersState((prev) =>
      prev?.map((fol) =>
        fol.id === folderId ? { ...fol, selected: !fol.selected } : fol
      )
    );
  }

  useEffect(() => {
    if (checkboxRef.current) {
      if (isSelectedAll) {
        checkboxRef.current.indeterminate = false;
      } else if (selectedFolders?.length && selectedFolders?.length >= 1) {
        checkboxRef.current.indeterminate = true;
      } else {
        checkboxRef.current.indeterminate = false;
      }
    }
  }, [isSelectedAll, selectedFolders?.length]);

  function onDeleteAllSelected() {
    setTransition(async () => {
      if (selectedFolders?.length) {
        for (let i = 0; i < selectedFolders.length; i++) {
          const folder = selectedFolders[i];

          if (folder.files.length) {
            for (let i = 0; i < folder.files.length; i++) {
              const fileUrl = folder.files[i].fileUrl;
              await edgestore.publicFiles.delete({
                url: fileUrl,
              });
            }
          }

          await deleteSelectedFolder(folder.id)
            .then(() => {
              if (selectedFolders.length - 1 === i) {
                toast.success("Deleted successfully");
                setOpenDeleteSelectedAll(false);
              }
            })
            .catch(() => toast.error("Something went wrong"));
        }
      }
    });
  }

  function onDeleteFolder() {
    const folderToDelete = foldersState?.find((fol) => fol.id === del?.id);

    setTransition(async () => {
      if (folderToDelete && folderToDelete.files.length) {
        for (let i = 0; i < folderToDelete.files.length; i++) {
          const fileUrl = folderToDelete.files[i].fileUrl;
          await edgestore.publicFiles.delete({
            url: fileUrl,
          });
        }
      }

      await deleteFolder(del?.id)
        .then(() => {
          toast.success("Deleted successfully");
          setDelete(null);
        })
        .catch(() => toast.error("Something went wrong"));
    });
  }

  function onAddFolders(formData: FormData) {
    setTransition(async () => {
      await addFolders(formData)
        .then(() => {
          toast.success("Added folder successfully");
          setAddFolder(false);
        })
        .catch(() => toast.error("Something went wrong"));
    });
  }

  function onRenameFolder(formData: FormData) {
    setTransition(async () => {
      await renameFolder(formData, edit?.id)
        .then(() => {
          toast.success("Rename successfully");
          setEdit(null);
        })
        .catch(() => toast.error("Something went wrong"));
    });
  }

  function countFolderSize(files: Files[]) {
    const sum = files.reduce(
      (accumulator, currentValue) =>
        accumulator + Number(currentValue.fileSize),
      0
    );

    return filesize(Number(sum), { standard: "jedec" });
  }

  return (
    <div>
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
            <h1 className="font-semibold text-lg">Delete folder</h1>
            <p className="text-sm text-gray-500">
              This action cannot be undone. This will permanently delete this
              folder.
            </p>
          </div>

          <div className="flex md:flex-row flex-col justify-end gap-2">
            <Button onClick={() => setDelete(null)} variant="outline">
              Cancel
            </Button>
            <Button onClick={onDeleteFolder} disabled={pending}>
              Continue
            </Button>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "fixed inset-0 bg-black/80 flex items-center justify-center z-[1002] duration-100",
          addFolder ? "opacity-100 visible" : "opacity-0 invisible"
        )}
      >
        <form
          key={String(addFolder)}
          action={onAddFolders}
          className={cn(
            "flex-1 space-y-4 bg-white p-7 md:rounded-lg max-w-[28rem] duration-200",
            addFolder ? "scale-100 visible" : "scale-95 invisible"
          )}
        >
          <div className="space-y-3">
            <h1 className="font-semibold text-lg">Add folder</h1>

            <Input
              type="text"
              name="folderName"
              required
              autoFocus
              autoComplete="off"
              placeholder="Enter the name of the folder"
              defaultValue="My Folder"
            />
          </div>

          <div className="flex md:flex-row flex-col justify-end gap-2">
            <Button
              type="button"
              disabled={pending}
              onClick={() => setAddFolder(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              Add
            </Button>
          </div>
        </form>
      </div>

      <div
        className={cn(
          "fixed inset-0 bg-black/80 flex items-center justify-center z-[1002] duration-100",
          edit?.id ? "opacity-100 visible" : "opacity-0 invisible"
        )}
      >
        <form
          action={onRenameFolder}
          key={edit?.id}
          className={cn(
            "flex-1 space-y-4 bg-white p-7 md:rounded-lg max-w-[28rem] duration-200",
            edit?.id ? "scale-100 visible" : "scale-95 invisible"
          )}
        >
          <div className="space-y-3">
            <h1 className="font-semibold text-lg">Rename</h1>

            <Input
              type="text"
              autoFocus
              name="newFolderName"
              required
              autoComplete="off"
              defaultValue={edit?.folderName}
              placeholder="Enter new folder name"
            />
          </div>

          <div className="flex md:flex-row flex-col justify-end gap-2">
            <Button
              type="button"
              disabled={pending}
              onClick={() => setEdit(null)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              Rename
            </Button>
          </div>
        </form>
      </div>

      <div className="flex items-center justify-between mb-3">
        <Button
          disabled={pending}
          onClick={() => setAddFolder(true)}
          className="space-x-2 bg-white hover:bg-white text-black"
        >
          <span>Add Folder</span> <FiPlus />
        </Button>

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
              <th className="p-2 w-[4rem]">
                <input
                  onChange={onSelectAll}
                  className="disabled:cursor-not-allowed"
                  type="checkbox"
                  ref={checkboxRef}
                  disabled={foldersState?.length === 0}
                  checked={!!foldersState?.length && isSelectedAll}
                />
              </th>

              {tableHead.map((th, idx) => (
                <th
                  key={idx}
                  className={cn(
                    "text-sm text-start font-medium whitespace-nowrap p-2",
                    idx === 1 && "w-[10rem]",
                    idx === 2 && "w-[10rem]",
                    idx === 3 && "w-[7rem]"
                  )}
                >
                  {th}
                </th>
              ))}

              <th className="p-2 w-[4rem] text-start">
                <Popover
                  onOpenChange={(e) => setOpenDeleteSelectedAll(e)}
                  open={isOpenDeleteSelectedll}
                >
                  <PopoverTrigger asChild>
                    <button className="cursor-pointer hover:bg-zinc-300 p-2 rounded-full">
                      <HiDotsVertical />
                    </button>
                  </PopoverTrigger>

                  <PopoverContent className="flex flex-col text-sm w-[15rem] shadow-md border border-zinc-300 p-2 mr-12">
                    <button
                      disabled={!selectedFolders?.length || pending}
                      onClick={onDeleteAllSelected}
                      className="flex items-center gap-2 p-2 hover:bg-zinc-200 rounded-md text-red-500 text-start disabled:text-red-300"
                    >
                      <RiDeleteBin6Fill /> Delete all selected
                    </button>
                  </PopoverContent>
                </Popover>
              </th>
            </tr>
          </thead>

          <tbody>
            {foldersState
              ?.filter((folder) =>
                folder.folderName.toLowerCase().includes(search)
              )
              ?.map((folder) => (
                <tr
                  key={folder.id}
                  className="space-y-2 border-y border-zinc-300 hover:bg-zinc-100 text-sm"
                >
                  <td className="min-w-[3rem] p-2">
                    <div className="flex justify-center">
                      <input
                        onChange={() => onSelect(folder.id)}
                        checked={folder.selected || false}
                        type="checkbox"
                      />
                    </div>
                  </td>
                  <td className="max-w-[25rem] min-w-[25rem] p-2">
                    <p className="flex items-center gap-4">
                      <IoFolderSharp className="text-amber-400 shrink-0" />
                      <Link
                        href={`/admin/files/${folder.id}`}
                        className="truncate hover:underline"
                      >
                        {folder.folderName}
                      </Link>
                    </p>
                  </td>
                  <td className="min-w-[10rem] p-2 text-zinc-500">
                    <p>{dateFormat.format(folder.createdAt)}</p>
                  </td>
                  <td className="min-w-[10rem] p-2 text-zinc-500">
                    <p>{dateFormat.format(folder.updatedAt)}</p>
                  </td>
                  <td className="min-w-[7rem] p-2 text-zinc-500">
                    <p>{countFolderSize(folder.files)}</p>
                  </td>
                  <td className="p-2 w-[4rem]">
                    <Popover
                      onOpenChange={(isOpen) =>
                        isOpen ? setOpenPopover(folder.id) : setOpenPopover("")
                      }
                    >
                      <PopoverTrigger asChild>
                        <button
                          disabled={
                            pending ||
                            (selectedFolders && selectedFolders?.length >= 2)
                          }
                          className={cn(
                            "p-2 rounded-full disabled:text-zinc-400",
                            openPopover === folder.id && "bg-zinc-300",
                            selectedFolders &&
                              selectedFolders.length <= 1 &&
                              "cursor-pointer hover:bg-zinc-300"
                          )}
                        >
                          <HiDotsVertical />
                        </button>
                      </PopoverTrigger>

                      <PopoverContent className="flex flex-col text-sm w-[15rem] shadow-md border border-zinc-300 p-2 mr-12">
                        <button
                          disabled={pending}
                          onClick={() => setEdit(folder)}
                          className="flex items-center gap-2 p-2 hover:bg-zinc-200 rounded-md text-start"
                        >
                          <MdModeEditOutline /> Rename
                        </button>
                        <button
                          disabled={pending}
                          onClick={() => setDelete(folder)}
                          className="flex items-center gap-2 p-2 hover:bg-zinc-200 rounded-md text-red-500 text-start"
                        >
                          <RiDeleteBin6Fill /> Delete
                        </button>
                      </PopoverContent>
                    </Popover>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
