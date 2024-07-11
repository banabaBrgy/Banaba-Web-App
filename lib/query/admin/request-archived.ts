import { db } from "@/lib/db";

export const getRequestArchived = async () => {
  const requestArchived = await db.documentRequest.findMany({
    where: {
      isArchived: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      requestedBy: {
        select: {
          fullName: true,
        },
      },
    },
  });

  return requestArchived;
};
