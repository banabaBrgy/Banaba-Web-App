import React from "react";
import FormAnnouncement from "./_components/form-announcement";
import AnnouncementRow from "./_components/announcement-row";
import { getAnnouncement } from "@/lib/query/admin/announcement";

export async function generateMetadata() {
  return {
    title: "Announcement",
  };
}

export default async function AnnouncementPage() {
  const announcements = await getAnnouncement();

  return (
    <div className="md:px-4 px-3 py-4">
      <div>
        <h1 className="text-lg font-semibold uppercase">Create Announcement</h1>
        <FormAnnouncement />
      </div>

      <div className="mt-4 space-y-4" id="announcement-row">
        <AnnouncementRow announcements={announcements} />
      </div>
    </div>
  );
}
