import { db } from "@/lib/db";
import { getUser } from "@/lib/user";

export async function GET() {
  try {
    const user = await getUser();

    if (!user?.id) {
      return new Response("Unauthorized user", { status: 401 });
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
    return new Response(error.message);
  }
}
