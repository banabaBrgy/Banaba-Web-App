"use server";

import { db } from "@/lib/db";
import { getUser } from "@/lib/user";

export async function markAsRead(notifId: string) {
  try {
    const user = await getUser();

    if (!user?.id) {
      throw new Error("Unauthorized user");
    }

    const markAsRead = await db.markAllAsRead.create({
      data: {
        notificationId: notifId,
        userId: user.id,
      },
    });

    return markAsRead;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function markAsUnread(notifId: string) {
  try {
    const user = await getUser();

    if (!user?.id) {
      throw new Error("Unauthorized user");
    }

    const markAsUnRead = await db.markAllAsRead.deleteMany({
      where: {
        notificationId: notifId,
        userId: user.id as string,
      },
    });

    return markAsUnRead;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function removeNotification(notifId: string) {
  try {
    const removeNotification = await db.notification.delete({
      where: {
        id: notifId,
      },
    });

    return removeNotification;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
