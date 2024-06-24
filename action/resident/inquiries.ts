"use server";

import { db } from "@/lib/db";
import { getUser } from "@/lib/user";
import { revalidatePath } from "next/cache";

export const createInquiries = async (formData: FormData) => {
  try {
    const user = await getUser();
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;

    if (!user || !user.id) {
      throw new Error("Unauthorized user!");
    }

    if (!subject || !message) {
      throw new Error("Subject and Message is required");
    }

    await db.inquiries.create({
      data: {
        userId: user.id,
        subject,
        message,
      },
    });

    revalidatePath("/");
  } catch (error: any) {
    throw new Error(error.message);
  }
};
