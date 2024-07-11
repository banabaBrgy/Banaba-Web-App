"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const unArchivedRequest = async (documentId: string) => {
  if (!documentId) {
    throw new Error("Missing documentId");
  }

  await db.documentRequest.update({
    where: {
      id: documentId,
    },
    data: {
      isArchived: false,
    },
  });

  revalidatePath("/");
};
