import { NextApiRequest } from "next";
import cookie from "cookie";
import { db } from "@/lib/db";
import jwt from "jsonwebtoken";

export async function getServerSession(request: NextApiRequest) {
  try {
    const cookies = cookie.parse(request.headers.cookie || "");
    const token = cookies.token;

    const { id } = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    const user = await db.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    return user;
  } catch {
    return null;
  }
}
