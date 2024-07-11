import { db } from "@/lib/db";

export async function getDisapprovedRequest() {
  const approvedRequest = await db.documentRequest.findMany({
    where: {
      isArchived: false,
      status: "Disapproved",
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      requestedBy: {
        select: {
          fullName: true,
        },
      },
    },
  });

  return approvedRequest;
}
