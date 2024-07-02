import { db } from "@/lib/db";

export const getSystemUsers = async () => {
  try {
    const systemUsers = await db.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return systemUsers;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};
