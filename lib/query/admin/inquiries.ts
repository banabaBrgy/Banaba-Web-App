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

export const getNoAnswersInquiries = async () => {
  try {
    const noAnswersInquiries = await db.inquiries.findMany({
      where: {
        answer: null,
      },
    });

    return noAnswersInquiries;
  } catch (error) {
    console.log(error);
  }
};
