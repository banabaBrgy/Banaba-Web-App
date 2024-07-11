import { db } from "@/lib/db";

export const getTotals = async () => {
  const totalPendingRequest = await db.documentRequest.findMany({
    where: {
      status: "Pending",
    },
  });

  const totalBlotters = await db.blotter.findMany({});

  return { totalPendingRequest, totalBlotters };
};

export const getCalendarActivities = async () => {
  try {
    const calendarActivities = await db.calendarOfActivities.findMany({});

    return calendarActivities;
  } catch (error: any) {
    console.log(error.message);
  }
};
