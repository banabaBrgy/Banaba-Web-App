"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createPrograms(about: string, photo: string | null) {
  try {
    if (!about || !photo) {
      throw new Error("About and Photo is required");
    }

    await db.programs.create({
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
