"use server";

import { getUser } from "@/lib/user";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function editProfile(
  formData: FormData,
  profile: string | null | undefined
) {
  const user = await getUser();

  const {
    firstName,
    lastName,
    email,
    mobile,
    birthDate,
    age,
    gender,
    civilStatus,
    placeOfBirth,
    sitioPurok,
  } = Object.fromEntries(formData.entries()) as any;

  try {
    if (user?.email !== email) {
      await db.user.update({
        where: {
          id: user?.id,
        },
        data: {
          isEmailVerified: null,
        },
      });
    }

    await db.user.update({
      where: {
        id: user?.id,
      },
      data: {
        fullName: `${firstName} ${lastName}`,
        firstName,
        lastName,
        email,
        mobile,
        birthDate,
        age: parseInt(age),
        gender,
        civilStatus,
        placeOfBirth,
        sitioPurok,
        profile,
      },
    });

    revalidatePath("/");
  } catch (error: any) {
    throw new Error("Error editing profile " + error.message);
  }
}
