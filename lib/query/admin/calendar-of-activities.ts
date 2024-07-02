import { db } from "@/lib/db";

export const getCalendarActivities = async () => {
  try {
    const calendarActivities = await db.calendarOfActivities.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return calendarActivities;
  } catch (error: any) {
    console.log(error.message);
  }
};
