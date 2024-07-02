import { db } from "@/lib/db";

export const getRequestPending = async () => {
  try {
    const requestPending = await db.documentRequest.findMany({
      where: {
        status: "Pending",
      },
      include: {
        requestedBy: {
          select: {
            fullName: true,
          },
        },
      },
    });

    return requestPending;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};
