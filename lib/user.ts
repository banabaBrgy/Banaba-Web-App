import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { db } from "./db";

function omitPassword(x: any) {
  delete x.password;
}

export const getUser = async () => {
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
  } catch (error) {
    throw new Error("Cannot get user" + error);
  }
};
