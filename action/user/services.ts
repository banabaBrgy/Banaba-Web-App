"use server";

import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { getUser } from "@/lib/user";
import { revalidatePath } from "next/cache";

export async function requestDocument(formData: FormData) {
  try {
    const user = await getUser();

    if (!user || !user.id) {
      return { error: "Unauthorized user" };
    }

    const documentType = formData.get("document") as string;
    const purposes = formData.get("purposes") as string;

    await db.$transaction(async (tx) => {
      const documentRequest = await tx.documentRequest.create({
        data: {
          documentType,
          requestedById: user.id,
          purposes,
        },
      });

      const notification = await tx.notification.create({
        data: {
          userId: user.id,
          message: `<strong>${user.fullName}</strong> requested a document: <strong>${documentRequest.documentType}</strong>`,
          path: `/admin/request-pending?id=${documentRequest.id}`,
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
}
