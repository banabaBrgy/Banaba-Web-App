"use server";

import { db } from "@/lib/db";
import { getUser } from "@/lib/user";
import { revalidatePath } from "next/cache";

export async function requestDocument(formData: FormData) {
  try {
    const user = await getUser();

    if (!user || !user.id) {
      throw new Error("Unauthorized user");
    }

    const documentType = formData.get("document") as string;
    const purposes = formData.get("purposes") as string;

    await db.myRequest.create({
      data: {
        documentType,
        requestedById: user.id,
        purposes,
      },
    });

    revalidatePath("/");
  } catch (error: any) {
    throw new Error("Something went wrong " + error.message);
  }
}
