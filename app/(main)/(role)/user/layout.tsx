import React, { ReactNode } from "react";
import { Sidebar } from "./_components/sidebar";
import { getUser } from "@/lib/user";
import { Navbar } from "./_components/navbar";
import { getUnreadAnnouncement } from "@/lib/query/user/announcement";
import { getUnreadPrograms } from "@/lib/query/user/programs";

export default async function UserLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getUser();
  const unreadAnnouncement = await getUnreadAnnouncement();
  const unreadPrograms = await getUnreadPrograms();

  return (
    <div className="min-h-[100dvh] bg-gray-100">
      <Navbar user={user} />
      <Sidebar
        user={user}
        unreadAnnouncement={unreadAnnouncement?.length || 0}
        unreadPrograms={unreadPrograms?.length || 0}
      />
      <div className="lg:ml-[16rem]">{children}</div>
    </div>
  );
}
