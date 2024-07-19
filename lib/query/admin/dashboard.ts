import { db } from "@/lib/db";

export const getTotals = async () => {
  const totalPendingRequest = await db.documentRequest.findMany({
    where: {
      status: "Pending",
    },
  });
  const totalBlotters = await db.blotter.findMany({});
  const inquiries = await db.inquiries.findMany({
    where: {
      answer: null,
    },
  });
  const calendarActivities = await db.calendarOfActivities.findMany({});

  return { totalPendingRequest, totalBlotters, inquiries, calendarActivities };
};

export const getCalendarActivities = async () => {
  try {
    const calendarActivities = await db.calendarOfActivities.findMany({});

    return calendarActivities;
  } catch (error: any) {
    console.log(error.message);
  }
};
