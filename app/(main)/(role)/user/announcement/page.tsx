import { getAnnouncement } from "@/lib/query/user/announcement";
import Image from "next/image";
import React from "react";

export default async function AnnouncementPage() {
  const announcements = await getAnnouncement();

  const tableHead = ["No.", "About", "Photo", "Uploaded"];

  const dateFormatter = Intl.DateTimeFormat("en-us", {
    dateStyle: "medium",
  });

  return (
    <div className="md:px-4 px-3 py-4">
      <h1 className="font-semibold text-lg uppercase">Announcement</h1>

      <div></div>
    </div>
  );
}
