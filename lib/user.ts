import jwt from "jsonwebtoken";
import { db } from "./db";
import { cookies } from "next/headers";

export interface UserType {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string | null;
  birthDate: string | null;
  age: number | null;
  gender: string | null;
  civilStatus: string | null;
  placeOfBirth: string | null;
  sitioPurok: string | null;
  profile: string | null;
  role: string;
  isEmailVerified: Date | null;
  isMobileVerified: Date | null;
  verificationCode: string | null;
  expiresAt: bigint | null;
  createdAt: Date;
  updatedAt: Date;
}

export async function getUser() {
  try {
    const token = cookies().get("token")?.value;

    if (!token) {
      return null;
    }

    const { id } = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    const user = await db.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        fullName: true,
        firstName: true,
        lastName: true,
        email: true,
        mobile: true,
        birthDate: true,
        age: true,
        gender: true,
        civilStatus: true,
        placeOfBirth: true,
        sitioPurok: true,
        profile: true,
        role: true,
        isEmailVerified: true,
        isMobileVerified: true,
        verificationCode: true,
        expiresAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  } catch {
    return null;
  }
}
