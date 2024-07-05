"use server";

import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { getUser } from "@/lib/user";
import { incompleteProfileInfo } from "@/utils/incomplete-profile-info";
import { revalidatePath } from "next/cache";

export const createInquiries = async (formData: FormData) => {
  try {
    const user = await getUser();
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;

    if (!user || !user.id) {
      throw new Error("Unauthorized user!");
    }

    incompleteProfileInfo(user);

    if (!subject || !message) {
      throw new Error("Subject and Message is required");
    }

    await db.$transaction(async (tx) => {
      const inquiries = await tx.inquiries.create({
        data: {
          userId: user.id,
          subject,
          message,
        },
      });

      const notification = await tx.notification.create({
        data: {
          userId: user.id,
          message: `New inquiry from <strong>${user.fullName}</strong>.`,
          path: `/admin/inquiries?id=${inquiries.id}`,
          notificationFor: "Admin",
        },
        include: {
          user: {
            select: {
              profile: true,
            },
          },
          markAllAsRead: true,
        },
      });

      await pusherServer.trigger("Admin", "admin:notification", notification);
    });

    revalidatePath("/");
  } catch (error: any) {
    throw new Error(error.message);
  }
};
