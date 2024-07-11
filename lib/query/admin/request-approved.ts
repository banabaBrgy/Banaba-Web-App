import { db } from "@/lib/db";

export const getRequestApproved = async () => {
  try {
    const requestApproved = await db.documentRequest.findMany({
      where: {
        status: "Approved",
        isArchived: false,
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
        issuedBy: {
          select: {
            fullName: true,
          },
        },
      },
    });

    return requestApproved;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};
