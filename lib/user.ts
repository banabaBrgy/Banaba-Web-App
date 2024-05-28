import jwt from "jsonwebtoken";
import { db } from "./db";
import { cookies } from "next/headers";

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
    });

    omitPassword(user);

    return user;
  } catch {
    return null;
  }
}

function omitPassword(x: any) {
  if (x) {
    delete x.password;
  }
}

export interface UserType {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
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
  verificationCode: string | null;
  expiresAt: bigint | null;
  createdAt: Date;
  updatedAt: Date;
}
