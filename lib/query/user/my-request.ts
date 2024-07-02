import { db } from "@/lib/db";
import { getUser } from "@/lib/user";

export const getMyRequest = async () => {
  try {
    const user = await getUser();

    if (!user || !user.id) {
      throw new Error("Unauthorized user");
    }

    const myRequest = await db.documentRequest.findMany({
      where: {
        requestedById: user?.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        issuedBy: {
          select: {
            fullName: true,
          },
        },
      },
    });

    return myRequest;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};
