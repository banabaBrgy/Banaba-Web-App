"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function archieveRequest(documentRequestId: string | undefined) {
  if (!documentRequestId) {
    throw new Error("Something went wrong");
  }

  await db.documentRequest.update({
    where: {
      id: documentRequestId,
    },
    data: {
      isArchived: true,
    },
  });

  revalidatePath("/");
}
