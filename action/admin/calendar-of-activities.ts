"use server";

import { db } from "@/lib/db";
import { CalendarOfActivities } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const createActivities = async (formData: FormData) => {
  try {
    const event = formData.get("event") as string;
    const description = formData.get("description") as string;
    const startDate = formData.get("startDate") as string;
    const endDate = formData.get("endDate") as string;

    if (!event || !description || !startDate || !endDate) {
      throw new Error("Event, Description, StartDate, EndDate is required");
    }

    await db.calendarOfActivities.create({
      data: {
        event,
        description,
        startDate,
        endDate,
      },
    });

    revalidatePath("/");
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export async function editCalendarOfActivities(
  editedCalendarAct: CalendarOfActivities | null
) {
  try {
    await db.calendarOfActivities.update({
      where: {
        id: editedCalendarAct?.id,
      },
      data: {
        event: editedCalendarAct?.event,
        description: editedCalendarAct?.description,
        startDate: editedCalendarAct?.startDate,
        endDate: editedCalendarAct?.endDate,
      },
    });

    revalidatePath("/");
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function deleteCalendarActivities(actId: string) {
  try {
    await db.calendarOfActivities.delete({
      where: {
        id: actId,
      },
    });

    revalidatePath("/");
  } catch (error: any) {
    throw new Error(error.message);
  }
}
