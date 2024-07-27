"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEdgeStore } from "@/lib/edgestore";
import { cn } from "@/lib/utils";
import React, {
  ElementRef,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { FiPlus } from "react-icons/fi";
import { HiDotsVertical } from "react-icons/hi";
import { MdModeEditOutline, MdOutlineSearch } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { MultiFileDropzone, type FileState } from "@/components/multi-file";
import {
  deleteFile,
  deleteSelectedFile,
  renameFile,
  uploadFiles,
} from "@/action/admin/files";
import { toast } from "sonner";
import { Files } from "@prisma/client";
import { filesize } from "filesize";
import { FaImages, FaFilePdf } from "react-icons/fa";
import { X } from "lucide-react";

type FilesRowProp = {
  files: (Files & { selected?: boolean })[] | undefined;
  folderId: string;
};

export function FilesRow({ files, folderId }: FilesRowProp) {
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const [filesDbState, setFilesDbState] = useState(files);
  const [edit, setEdit] = useState<Files | null>(null);
  const [del, setDelete] = useState<Files | null>(null);
  const [pending, setTransition] = useTransition();
  const [openPopover, setOpenPopover] = useState("");
  const [isOpenDeleteSelectedAll, setOpenDeleteSelectedAll] = useState(false);
  const [search, setSearch] = useState("");
  const { edgestore } = useEdgeStore();
  const [openUploadFileModal, setOpenUploadFileModal] = useState(false);
  const uploadFileModalPopUpRef = useRef<ElementRef<"div">>(null);
  const fileUploaBtnRef = useRef<ElementRef<"button">>(null);
  const checkBoxRef = useRef<ElementRef<"input">>(null);

  const tableHead = ["Name", "Date created", "Last modified", "File size"];

  const dateFormat = Intl.DateTimeFormat("en-us", {
    dateStyle: "medium",
  });

  const isSelectedAllFiles = filesDbState?.every(
    (file) => file.selected === true
  );

  const selectedFiles = filesDbState?.filter((file) => file.selected === true);

  useEffect(() => {
    setFilesDbState(files);
  }, [files]);

  useEffect(() => {
    if (openUploadFileModal) {
      document.body.style.overflow = "clip";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [openUploadFileModal]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        !uploadFileModalPopUpRef.current?.contains(e.target as any) &&
        !fileUploaBtnRef.current?.contains(e.target as any)
      ) {
        setOpenUploadFileModal(false);
        setFileStates([]);
      }
    }

    window.addEventListener("click", handleClick);

    return () => window.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    if (checkBoxRef.current) {
      if (isSelectedAllFiles) {
        checkBoxRef.current.indeterminate = false;
      } else if (selectedFiles?.length && selectedFiles.length >= 1) {
        checkBoxRef.current.indeterminate = true;
      } else {
        checkBoxRef.current.indeterminate = false;
      }
    }
  }, [isSelectedAllFiles, selectedFiles?.length]);

  function updateFileProgress(key: string, progress: FileState["progress"]) {
    setFileStates((fileStates) => {
      const newFileStates = structuredClone(fileStates);
      const fileState = newFileStates.find(
        (fileState) => fileState.key === key
      );
      if (fileState) {
        fileState.progress = progress;
      }
      return newFileStates;
    });
  }

  function onSelectAllFile() {
    if (isSelectedAllFiles) {
      setFilesDbState((prev) =>
        prev?.map((file) => ({ ...file, selected: false }))
      );
    } else {
      setFilesDbState((prev) =>
        prev?.map((file) =>
          file.selected !== true ? { ...file, selected: true } : file
        )
      );
    }
  }

  function onSelectFile(fileId: string, checked: boolean) {
    setFilesDbState((prev) =>
      prev?.map((item) =>
        item.id === fileId ? { ...item, selected: checked } : item
      )
    );
  }

  function onDeleteAllSelectedFile() {
    selectedFiles?.forEach((item, idx) => {
      setTransition(async () => {
        if (item.fileUrl) {
          await edgestore.publicFiles.delete({
            url: item.fileUrl,
          });
        }

        await deleteSelectedFile(item.id)
          .then(() => {
            if (selectedFiles.length - 1 === idx) {
              toast.success("Deleted successfully");
              setOpenDeleteSelectedAll(false);
            }
          })
          .catch(() => toast.error("Something went wrong"));
      });
    });
  }

  function onDeleteFile() {
    setTransition(async () => {
      if (del?.fileUrl) {
        await edgestore.publicFiles.delete({
          url: del.fileUrl,
        });
      }

      await deleteFile(del?.id)
        .then(() => {
          toast.success("Deleted successfully");
          setDelete(null);
        })
        .catch(() => toast.error("Something went wrong"));
    });
  }

  function onRenameFile(formData: FormData) {
    setTransition(async () => {
      await renameFile(formData, edit?.id)
        .then(() => {
          toast.success("Rename successfully");
          setEdit(null);
        })
        .catch(() => toast.error("Something went wrong"));
    });
  }

  return (
    <div>
      <div
        className={cn(
          "fixed inset-0 bg-black/70 flex justify-center z-[1001] py-10 duration-200 overflow-auto",
          openUploadFileModal ? "visible opacity-100" : "invisible opacity-0"
        )}
      >
        <div
          ref={uploadFileModalPopUpRef}
          className={cn(
            "relative bg-white p-5 my-auto rounded-md flex-1 max-w-[40rem] mx-3",
            openUploadFileModal
              ? "scale-100 visible opacity-100"
              : "scale-95 invisible opacity-0"
          )}
        >
          <button
            onClick={() => setOpenUploadFileModal(false)}
            className="absolute -right-4 -top-4 bg-white rounded-full p-2 text-gray-500"
          >
            <X size={15} />
          </button>

          <div className="flex items-center justify-center">
            <MultiFileDropzone
              value={fileStates}
              className="h-[15rem]"
              onChange={(files) => {
                setFileStates(files);
              }}
              onFilesAdded={async (addedFiles) => {
                setFileStates([...fileStates, ...addedFiles]);
                await Promise.all(
                  addedFiles.map(async (addedFileState, idx) => {
                    try {
                      const res = await edgestore.publicFiles.upload({
                        file: addedFileState.file,
                        onProgressChange: async (progress) => {
                          updateFileProgress(addedFileState.key, progress);
                          if (progress === 100) {
                            // wait 1 second to set it to complete
                            // so that the user can see the progress bar at 100%
                            await new Promise((resolve) =>
                              setTimeout(resolve, 1000)
                            );
                            updateFileProgress(addedFileState.key, "COMPLETE");
                          }
                        },
                      });

                      await uploadFiles(
                        addedFileState.file.name,
                        addedFileState.file.size,
                        addedFileState.file.type,
                        res.url,
                        addedFileState.file.lastModified,
                        folderId
                      )
                        .then(() => {
                          if (idx === fileStates.length) {
                            toast.success("Uploaded successfully");
                            setFileStates([]);
                            setOpenUploadFileModal(false);
                          }
                        })
                        .catch(() => toast.error("Something went wrong"));
                    } catch (err) {
                      updateFileProgress(addedFileState.key, "ERROR");
                    }
                  })
                );
              }}
            />
          </div>
        </div>
      </div>

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
              This action cannot be undone. This will permanently delete this{" "}
              <strong>{del?.fileName}</strong> file.
            </p>
          </div>

          <div className="flex md:flex-row flex-col justify-end gap-2">
            <Button onClick={() => setDelete(null)} variant="outline">
              Cancel
            </Button>
            <Button onClick={onDeleteFile} disabled={pending}>
              Continue
            </Button>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "fixed inset-0 bg-black/80 flex items-center justify-center z-[1002] duration-100",
          edit?.id ? "opacity-100 visible" : "opacity-0 invisible"
        )}
      >
        <form
          action={onRenameFile}
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
              name="newFileName"
              required
              autoComplete="off"
              defaultValue={edit?.fileName}
              placeholder="Enter new file name"
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
          ref={fileUploaBtnRef}
          onClick={() => setOpenUploadFileModal(true)}
          className="space-x-2 bg-white hover:bg-white text-black"
        >
          <span>File upload</span> <FiPlus />
        </Button>

        <div className="relative flex items-center flex-1 max-w-[20rem]">
          <MdOutlineSearch className="absolute right-3 scale-[1.4] text-zinc-400" />
          <Input
            onChange={(e) => setSearch(e.target.value.toLowerCase())}
            type="text"
            value={search}
            placeholder="Search"
            className="pr-10"
          />
        </div>
      </div>

      <div className="overflow-auto">
        <table className="border-collapse bg-white w-full">
          <thead>
            <tr>
              <th className="p-2 w-[4rem]">
                <input
                  type="checkbox"
                  className="disabled:cursor-not-allowed"
                  ref={checkBoxRef}
                  disabled={filesDbState?.length === 0}
                  checked={isSelectedAllFiles && !!filesDbState?.length}
                  onChange={onSelectAllFile}
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
                  open={isOpenDeleteSelectedAll}
                  onOpenChange={(e) => setOpenDeleteSelectedAll(e)}
                >
                  <PopoverTrigger asChild>
                    <button className="cursor-pointer hover:bg-zinc-300 p-2 rounded-full">
                      <HiDotsVertical />
                    </button>
                  </PopoverTrigger>

                  <PopoverContent className="flex flex-col text-sm w-[15rem] shadow-md border border-zinc-300 p-2 mr-12">
                    <button
                      disabled={pending || selectedFiles?.length === 0}
                      onClick={onDeleteAllSelectedFile}
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
            {filesDbState
              ?.filter((file) => file.fileName.toLowerCase().includes(search))
              ?.map((file) => (
                <tr
                  key={file.id}
                  className="space-y-2 border-y border-zinc-300 hover:bg-zinc-100 text-sm"
                >
                  <td className="min-w-[3rem] p-2">
                    <div className="flex justify-center">
                      <input
                        type="checkbox"
                        onChange={(e) =>
                          onSelectFile(file.id, e.target.checked)
                        }
                        checked={file.selected || false}
                      />
                    </div>
                  </td>
                  <td className="max-w-[25rem] min-w-[25rem] p-2">
                    <p className="flex items-center gap-4">
                      {file.fileType.includes("image") && (
                        <FaImages className="text-red-500 shrink-0" />
                      )}
                      {file.fileType.includes("pdf") && (
                        <FaFilePdf className="text-blue-500 shrink-0" />
                      )}
                      <a
                        href={file.fileUrl}
                        target="_blank"
                        className="truncate hover:underline"
                      >
                        {file.fileName}
                      </a>
                    </p>
                  </td>
                  <td className="min-w-[10rem] p-2 text-zinc-500">
                    <p>{dateFormat.format(file.createdAt)}</p>
                  </td>
                  <td className="min-w-[10rem] p-2 text-zinc-500">
                    <p>{dateFormat.format(Number(file.lastModified))}</p>
                  </td>
                  <td className="min-w-[7rem] p-2 text-zinc-500">
                    <p>
                      {filesize(Number(file.fileSize), { standard: "jedec" })}
                    </p>
                  </td>
                  <td className="p-2 w-[4rem]">
                    <Popover
                      onOpenChange={(e) =>
                        e ? setOpenPopover(file.id) : setOpenPopover("")
                      }
                    >
                      <PopoverTrigger asChild>
                        <button
                          disabled={
                            pending ||
                            (selectedFiles && selectedFiles?.length >= 2)
                          }
                          className={cn(
                            "p-2 rounded-full disabled:text-zinc-400 hover:bg-zinc-300",
                            openPopover === file.id && "bg-zinc-300",
                            selectedFiles?.length &&
                              selectedFiles?.length <= 1 &&
                              "cursor-pointer hover:bg-zinc-300"
                          )}
                        >
                          <HiDotsVertical />
                        </button>
                      </PopoverTrigger>

                      <PopoverContent className="flex flex-col text-sm w-[15rem] shadow-md border border-zinc-300 p-2 mr-12">
                        <button
                          onClick={() => setEdit(file)}
                          className="flex items-center gap-2 p-2 hover:bg-zinc-200 rounded-md text-start"
                        >
                          <MdModeEditOutline /> Rename
                        </button>
                        <button
                          onClick={() => setDelete(file)}
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
