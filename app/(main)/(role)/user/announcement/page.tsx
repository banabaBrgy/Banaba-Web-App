import { getAnnouncement } from "@/lib/query/user/announcement";
import React from "react";
import AnnouncementRow from "./_components/announcement-row";

export async function generateMetadata() {
  return {
    title: "Announcement",
  };
}

export default async function AnnouncementPage() {
  const announcements = await getAnnouncement();

  return (
    <div className="md:px-4 px-3 py-4">
      <h1 className="font-semibold sm:text-lg text-sm uppercase">
        Announcement
      </h1>

      <AnnouncementRow announcements={announcements} />
    </div>
  );
}
