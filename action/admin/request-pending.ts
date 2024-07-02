"use server";

import { db } from "@/lib/db";
import { getUser } from "@/lib/user";
import { incompleteProfileInfo } from "@/utils/incomplete-profile-info";
import { revalidatePath } from "next/cache";

export async function approvedRequest(documentRequestId: string) {
  try {
    const user = await getUser();

    if (!user || !user.id) {
      throw new Error("Unauthorized user");
    }

    incompleteProfileInfo(user);

    if (user.role === "User") {
      throw new Error("Something went wrong");
    }

    await db.documentRequest.update({
      where: {
        id: documentRequestId,
      },
      data: {
        status: "Approved",
        issuedById: user?.id,
        dateIssued: new Date(),
      },
    });

    revalidatePath("/");
  } catch (error: any) {
    throw new Error(error.message);
  }
}
