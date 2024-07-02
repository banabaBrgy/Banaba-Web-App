import { db } from "@/lib/db";

export const getPrograms = async () => {
  try {
    const programs = await db.programs.findMany({});

    return programs;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};
