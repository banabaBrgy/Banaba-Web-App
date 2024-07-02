import { db } from "@/lib/db";

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
    return null;
  }
};
