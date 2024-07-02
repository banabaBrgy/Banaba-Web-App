"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function changeRole(userId: string, role: "Admin" | "User") {
  try {
    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        role: role,
      },
    });

    revalidatePath("/");
  } catch (error: any) {
    throw new Error(error.message);
  }
}
