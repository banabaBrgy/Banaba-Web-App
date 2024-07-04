import { getFiles, getFolders } from "@/lib/query/admin/files";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { IoChevronForwardOutline } from "react-icons/io5";
import { FilesRow } from "./_components/files-row";

export default async function FolderIdPage({
  params,
}: {
  params: { folderId: string };
}) {
  const { folderId } = params;
  const folders = await getFolders();
  const files = await getFiles(folderId);

  const folderNameOpen = folders?.find((fol) => fol.id === folderId);

  return (
    <div className="md:px-4 px-3 py-4">
      <div className="flex items-center gap-2">
        <Link
          href="/admin/files"
          className={cn(
            "text-lg font-semibold uppercase",
            folderId ? "text-zinc-500 hover:text-black" : "text-black"
          )}
        >
          Folder
        </Link>
        <IoChevronForwardOutline
          className={cn(folderId ? "text-zinc-500" : "hidden")}
        />
        <h1
          className={cn(
            "text-lg font-semibold uppercase",
            !folderId && "hidden"
          )}
        >
          {folderNameOpen?.folderName}
        </h1>
      </div>

      <div className="mt-4">
        <FilesRow files={files} folderId={folderId} />
      </div>
    </div>
  );
}
