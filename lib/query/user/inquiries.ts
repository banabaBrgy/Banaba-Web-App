import { db } from "@/lib/db";
import { getUser } from "@/lib/user";

export async function getInquiries() {
  try {
    const user = await getUser();

    if (!user?.id) {
      throw new Error("Unauthorized user");
    }

    const inquiries = await db.inquiries.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return inquiries;
  } catch (error) {
    console.log(error);
  }
}
