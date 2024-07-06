"use server";

import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { revalidatePath } from "next/cache";

export async function answerInquiries(
  formData: FormData,
  inquiriesId: string | undefined
) {
  try {
    const answer = formData.get("answer") as string;

    await db.$transaction(async (tx) => {
      const inquiries = await tx.inquiries.update({
        where: {
          id: inquiriesId,
        },
        data: {
          answer,
        },
        include: {
          user: {
            select: {
              fullName: true,
            },
          },
        },
      });

      const notification = await tx.notification.create({
        data: {
          userId: inquiries.userId,
          message: `<strong>${inquiries.user.fullName}</strong>, your inquiry has been answered`,
          path: `/user/inquiries?id=${inquiries.id}`,
          notificationFor: "User",
        },
        include: {
          markAllAsRead: true,
        },
      });

      await pusherServer.trigger(
        inquiries.userId,
        "user:notification",
        notification
      );
    });

    revalidatePath("/");
  } catch (error: any) {
    throw new Error(error.message);
  }
}
