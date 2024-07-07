"use server";

import { db } from "@/lib/db";
import { getUnreadAnnouncement } from "@/lib/query/user/announcement";
import { getUser } from "@/lib/user";
import { revalidatePath } from "next/cache";

export async function markAnnouncementAsRead() {
  const user = await getUser();
  const unreadAnnouncements = await getUnreadAnnouncement();

  if (!user?.id) return;

  if (!unreadAnnouncements?.length || unreadAnnouncements?.length === 0) return;

  for (const unreadAnnouncement of unreadAnnouncements) {
    await db.markAllAsRead.create({
      data: {
        userId: user?.id,
        announcementId: unreadAnnouncement.id,
      },
    });
  }

  revalidatePath("/");
}
