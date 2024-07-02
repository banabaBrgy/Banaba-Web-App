import { db } from "@/lib/db";

export const getPrograms = async () => {
  try {
    const programs = await db.programs.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return programs;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};
