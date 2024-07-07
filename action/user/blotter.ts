"use server";

import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { getUser } from "@/lib/user";
import { revalidatePath } from "next/cache";

interface ValueType {
  incident: string;
  placeOfIncident: string;
  dateTime: string;
  witnesses: string[];
  narrative: string;
}

export async function createBlotter(value: ValueType) {
  try {
    const user = await getUser();

    const { incident, placeOfIncident, dateTime, witnesses, narrative } = value;

    if (!user || !user.id) {
      return { error: "Unauthorized user" };
    }

    const filterBlankWitnesses = witnesses.filter((w) => w !== "");

    await db.$transaction(async (tx) => {
      const blotter = await tx.blotter.create({
        data: {
          userId: user.id,
          incident,
          placeOfIncident,
          dateTime,
          witnesses: filterBlankWitnesses,
          narrative,
        },
      });

      const notification = await tx.notification.create({
        data: {
          userId: user.id,
          message: `New blotter entry from <strong>${user.fullName}</strong>`,
          path: `/admin/blotter?id=${blotter.id}`,
          notificationFor: "Admin",
        },
        include: {
          user: {
            select: {
              profile: true,
            },
          },
          markAllAsRead: true,
        },
      });

      await pusherServer.trigger("Admin", "admin:notification", notification);
    });

    revalidatePath("/");
  } catch (error: any) {
    throw new Error(error.message);
  }
}
