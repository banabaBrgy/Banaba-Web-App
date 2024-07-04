import { db } from "@/lib/db";
import { getUser } from "@/lib/user";

export async function getFolders() {
  try {
    const user = await getUser();

    if (!user?.id) {
      throw new Error("Unauthorized user");
    }

    if (user.role !== "Admin") {
      throw new Error("Forbidden request denied");
    }

    const folders = await db.folders.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        files: true,
      },
    });

    return folders;
  } catch (error: any) {
    console.log(error.message);
  }
}

export async function getFiles(folderId: string) {
  try {
    const user = await getUser();

    if (!user?.id) {
      throw new Error("Unauthorized user");
    }

    if (user.role !== "Admin") {
      throw new Error("Forbidden request denied");
    }

    const files = await db.files.findMany({
      where: {
        folderId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return files;
  } catch (error) {
    console.log(error);
  }
}
