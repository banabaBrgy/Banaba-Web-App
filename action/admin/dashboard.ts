"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

type ActivitiesType = {
  event: string;
  description: string;
  startDate: string;
  endDate: string;
};

export const createCalendarActivities = async (formData: FormData) => {
  const { event, description, startDate, endDate } = Object.fromEntries(
    formData.entries()
  ) as ActivitiesType;

  if (!event || !description || !startDate || !endDate) {
    throw new Error("Missing information");
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
};

export const editCalendarActivities = async (
  formData: FormData,
  id: string | undefined
) => {
  const { event, description, startDate, endDate } = Object.fromEntries(
    formData.entries()
  ) as ActivitiesType;

  console.log(startDate, endDate);

  if (!id || !event || !description || !startDate || !endDate) {
    throw new Error("Missing information");
  }

  await db.calendarOfActivities.update({
    where: {
      id,
    },
    data: {
      event,
      description,
      startDate,
      endDate,
    },
  });

  revalidatePath("/");
};

export const deleteCalendarActivities = async (id: string | undefined) => {
  if (!id) {
    throw new Error("Missing id");
  }

  await db.calendarOfActivities.delete({
    where: {
      id,
    },
  });

  revalidatePath("/");
};
