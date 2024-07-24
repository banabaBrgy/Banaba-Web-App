import { db } from "@/lib/db";
import { getUser } from "@/lib/user";

export const getAnnouncement = async () => {
  try {
    const announcement = await db.announcement.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return announcement;
  } catch (error: any) {
    console.log(error.message);
  }
};

export async function getUnreadAnnouncement() {
  try {
    const user = await getUser();

    const unreadAnnouncement = await db.announcement.findMany({
      where: {
        markAllAsRead: {
          none: {
            userId: user?.id,
          },
        },
      },
    });

    return unreadAnnouncement;
  } catch (error) {
    console.log(error);
  }
}
