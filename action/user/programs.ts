"use server";

import { db } from "@/lib/db";
import { getUnreadPrograms } from "@/lib/query/user/programs";
import { getUser } from "@/lib/user";
import { revalidatePath } from "next/cache";

export async function markProgramsAsRead() {
  const user = await getUser();
  const unreadPrograms = await getUnreadPrograms();

  if (!user?.id) return;

  if (!unreadPrograms?.length || unreadPrograms.length === 0) return;

  for (const unreadProgram of unreadPrograms) {
    await db.markAllAsRead.create({
      data: {
        userId: user.id,
        programsId: unreadProgram.id,
      },
    });
  }

  revalidatePath("/");
}
