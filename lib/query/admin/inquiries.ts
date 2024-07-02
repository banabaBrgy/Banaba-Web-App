import { db } from "@/lib/db";

export const getInquiries = async () => {
  try {
    const inquiries = await db.inquiries.findMany({
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
            mobile: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return inquiries;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};
