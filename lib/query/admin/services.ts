import { db } from "@/lib/db";

export async function getServices() {
  try {
    const services = await db.documentType.findMany({});

    return services;
  } catch (error: any) {
    console.log(error.message);
  }
}
