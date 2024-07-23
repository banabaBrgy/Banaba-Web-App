import { db } from "@/lib/db";
import { getUser } from "@/lib/user";

export const getCalendarActivities = async () => {
  try {
    const calendarActivities = await db.calendarOfActivities.findMany({});

    return calendarActivities;
  } catch (error: any) {
    console.log(error.message);
  }
};
