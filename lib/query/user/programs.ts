import { db } from "@/lib/db";
import { getUser } from "@/lib/user";

export const getPrograms = async () => {
  try {
    const programs = await db.programs.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return programs;
  } catch (error: any) {
    console.log(error.message);
  }
};

export async function getUnreadPrograms() {
  try {
    const user = await getUser();

    const unreadPrograms = await db.programs.findMany({
      where: {
        markAllAsRead: {
          none: {
            userId: user?.id,
          },
        },
      },
    });

    return unreadPrograms;
  } catch (error) {
    console.log(error);
  }
}
