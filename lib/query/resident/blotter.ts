import { db } from "@/lib/db";
import { getUser } from "@/lib/user";

export const getCreatedBlotters = async () => {
  try {
    const user = await getUser();

    if (!user || !user.id) {
      throw new Error("Unauthorized user");
    }

    const createdBlotters = await db.blotter.findMany({
      where: {
        userId: user.id,
      },
    });

    return createdBlotters;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};
