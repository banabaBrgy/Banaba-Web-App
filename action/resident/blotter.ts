"use server";

import { db } from "@/lib/db";
import { getUser } from "@/lib/user";
import { revalidatePath } from "next/cache";

interface ValueType {
  barangayPurokSitio: string;
  incident: string;
  placeOfIncident: string;
  dateTime: string;
  witnesses: string[];
  narrative: string;
}

export async function createBlotter(value: ValueType) {
  try {
    const user = await getUser();

    const {
      barangayPurokSitio,
      incident,
      placeOfIncident,
      dateTime,
      witnesses,
      narrative,
    } = value;

    if (!user || !user.id) {
      throw new Error("Unauthorized user!");
    }

    const filterBlankWitnesses = witnesses.filter((w) => w !== "");

    await db.blotter.create({
      data: {
        userId: user.id,
        barangayPurokSitio,
        incident,
        placeOfIncident,
        dateTime,
        witnesses: filterBlankWitnesses,
        narrative,
      },
    });

    revalidatePath("/");
  } catch (error: any) {
    throw new Error(error.message);
  }
}
