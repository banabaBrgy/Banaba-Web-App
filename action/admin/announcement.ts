"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createAnnouncement(about: string, photo: string | null) {
  try {
    if (!about || !photo) {
      throw new Error("About and Photo is required");
    }

    await db.announcement.create({
      data: {
        about,
        photo,
      },
    });

    revalidatePath("/");
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function editAnnouncement(
  announcementId: string | undefined,
  about: string | undefined,
  photo: string | undefined
) {
  try {
    await db.announcement.update({
      where: {
        id: announcementId,
      },
      data: {
        about,
        photo,
      },
    });

    revalidatePath("/");
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function deleteAnnouncement(announcementId: string | undefined) {
  try {
    await db.announcement.delete({
      where: {
        id: announcementId,
      },
    });

    revalidatePath("/");
  } catch (error: any) {
    throw new Error(error.message);
  }
}
