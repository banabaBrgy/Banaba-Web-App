import { NextApiRequest, NextApiResponse } from "next";
import { pusherServer } from "@/lib/pusher";
import { getServerSession } from "@/utils/get-server-session";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const user = await getServerSession(request);

  if (!user?.id) {
    return response.status(401);
  }

  const socketId = request.body.socket_id;
  const channel = request.body.channel_name;
  const data = {
    user_id: `${user.id}`,
  };

  const authResponse = pusherServer.authorizeChannel(socketId, channel, data);

  return response.send(authResponse);
}
