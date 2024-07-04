"use server";

import { db } from "@/lib/db";
import { getUser } from "@/lib/user";
import { revalidatePath } from "next/cache";

export async function addFolders(formData: FormData) {
  try {
    const user = await getUser();
    const folderName = formData.get("folderName") as string;

    if (!user?.id) {
      throw new Error("Unauthorized user");
    }

    await db.folders.create({
      data: {
        folderName: folderName || "My Folder",
      },
    });

    revalidatePath("/");
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function deleteFolder(folderId: string | undefined) {
  try {
    await db.folders.delete({
      where: {
        id: folderId,
      },
    });

    revalidatePath("/");
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function deleteSelectedFolder(foldersId: string) {
  try {
    await db.folders.delete({
      where: {
        id: foldersId,
      },
    });

    revalidatePath("/");
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function renameFolder(
  formData: FormData,
  folderId: string | undefined
) {
  try {
    const newFolderName = formData.get("newFolderName") as string;

    await db.folders.update({
      where: {
        id: folderId,
      },
      data: {
        folderName: newFolderName,
      },
    });

    revalidatePath("/");
  } catch (error: any) {
    throw new Error(error.message);
  }
}

// Files Row

export async function uploadFiles(
  fileName: string,
  fileSize: number,
  fileType: string,
  fileUrl: string,
  lastModified: number,
  folderId: string
) {
  try {
    await db.files.create({
      data: {
        fileName: fileName || "Untitled",
        fileSize,
        fileType,
        fileUrl,
        lastModified,
        folderId,
      },
    });

    revalidatePath("/");
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function deleteFile(fileId: string | undefined) {
  try {
    await db.files.delete({
      where: {
        id: fileId,
      },
    });

    revalidatePath("/");
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function deleteSelectedFile(filesId: string) {
  try {
    await db.files.delete({
      where: {
        id: filesId,
      },
    });

    revalidatePath("/");
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function renameFile(
  formData: FormData,
  fileId: string | undefined
) {
  try {
    const newFileName = formData.get("newFileName") as string;

    await db.files.update({
      where: {
        id: fileId,
      },
      data: {
        fileName: newFileName,
      },
    });

    revalidatePath("/");
  } catch (error: any) {
    throw new Error(error.message);
  }
}
