import React from "react";
import { FolderRow } from "./_components/folder-row";
import { getFolders } from "@/lib/query/admin/files";

export async function generateMetadata() {
  return {
    title: "Files",
  };
}

export default async function FilesPage() {
  const folders = await getFolders();

  return (
    <div className="md:px-4 px-3 py-4">
      <h1 className="text-lg font-semibold uppercase">FOLDER</h1>

      <div className="mt-4">
        <FolderRow folders={folders} />
      </div>
    </div>
  );
}
