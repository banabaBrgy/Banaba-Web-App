"use server";

import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { getUser } from "@/lib/user";
import { incompleteProfileInfo } from "@/utils/incomplete-profile-info";
import { revalidatePath } from "next/cache";

export async function approvedRequest(documentRequestId: string) {
  try {
    const user = await getUser();

    if (!user || !user.id) {
      throw new Error("Unauthorized user");
    }

    incompleteProfileInfo(user);

    if (user.role === "User") {
      throw new Error("Something went wrong");
    }

    await db.$transaction(async (tx) => {
      const documentRequest = await tx.documentRequest.update({
        where: {
          id: documentRequestId,
        },
        data: {
          status: "Approved",
          issuedById: user?.id,
          dateIssued: new Date(),
        },
        include: {
          requestedBy: {
            select: {
              fullName: true,
            },
          },
        },
      });

      const notification = await tx.notification.create({
        data: {
          userId: documentRequest.requestedById,
          message: `<strong>${documentRequest.requestedBy.fullName}</strong>, your document request for <strong>${documentRequest.documentType}</strong> has been approved`,
          path: `/user/my-request?id=${documentRequest.id}`,
          notificationFor: "User",
        },
        include: {
          markAllAsRead: true,
        },
      });

      await pusherServer.trigger(
        documentRequest.requestedById,
        "user:notification",
        notification
      );
    });

    revalidatePath("/");
  } catch (error: any) {
    throw new Error(error.message);
  }
}
