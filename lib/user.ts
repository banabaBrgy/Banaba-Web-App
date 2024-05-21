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
