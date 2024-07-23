"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const deletePendingRequest = async (requestId: string) => {
  await db.documentRequest.delete({
    where: {
      id: requestId,
    },
  });

  revalidatePath("/");
};
