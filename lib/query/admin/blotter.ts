import { db } from "@/lib/db";

export const getBlotters = async () => {
  try {
    const blotter = await db.blotter.findMany({
      include: {
        user: {
          select: {
            fullName: true,
            sitioPurok: true,
          },
        },
      },
    });

    return blotter;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};
