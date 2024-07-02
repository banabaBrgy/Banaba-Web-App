"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function answerInquiries(
  formData: FormData,
  inquiriesId: string | undefined
) {
  try {
    const answer = formData.get("answer") as string;

    await db.inquiries.update({
      where: {
        id: inquiriesId,
      },
      data: {
        answer,
      },
    });

    revalidatePath("/");
  } catch (error: any) {
    throw new Error(error.message);
  }
}
