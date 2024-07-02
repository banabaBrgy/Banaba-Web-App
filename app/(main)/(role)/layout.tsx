import { getUser } from "@/lib/user";
import { SocketProvider } from "@/utils/socket-provider";
import React, { ReactNode } from "react";

export default async function RoleLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getUser();

  return (
    <div>
      <SocketProvider user={user}>{children}</SocketProvider>
    </div>
  );
}
