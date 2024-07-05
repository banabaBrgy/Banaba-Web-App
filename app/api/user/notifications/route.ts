import { db } from "@/lib/db";
import { getUser } from "@/lib/user";

export async function GET() {
  try {
    const user = await getUser();

    if (!user?.id) {
      return Response.json("Unauthorized user", { status: 403 });
    }

    const notifications = await db.notification.findMany({
      where: {
        userId: user.id,
        notificationFor: "User",
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        markAllAsRead: true,
      },
    });

    return Response.json(notifications, { status: 200 });
  } catch (error: any) {
    return Response.json(error.message);
  }
}
