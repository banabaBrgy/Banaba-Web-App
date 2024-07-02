"use server";

import { db } from "@/lib/db";
import { getUser } from "@/lib/user";
import { incompleteProfileInfo } from "@/utils/incomplete-profile-info";
import { revalidatePath } from "next/cache";

export async function requestDocument(formData: FormData) {
  try {
    const user = await getUser();

    if (!user || !user.id) {
      throw new Error("Unauthorized user");
    }

    incompleteProfileInfo(user);

    const documentType = formData.get("document") as string;
    const purposes = formData.get("purposes") as string;

    await db.documentRequest.create({
      data: {
        documentType,
        requestedById: user.id,
        purposes,
      },
    });

    revalidatePath("/");
  } catch (error: any) {
    throw new Error(error.message);
  }
}
