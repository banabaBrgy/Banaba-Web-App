"use client";

import { markAnnouncementAsRead } from "@/action/user/announcement";
import { Announcement } from "@prisma/client";
import Image from "next/image";
import React, { useEffect } from "react";

interface AnnouncementRowProp {
  announcements: Announcement[] | undefined;
}

export default function AnnouncementRow({
  announcements,
}: AnnouncementRowProp) {
  const tableHead = ["About", "Photo", "Uploaded"];

  const dateFormatter = Intl.DateTimeFormat("en-us", {
    dateStyle: "medium",
  });

  useEffect(() => {
    markAnnouncementAsRead();
  }, []);

  return (
    <div className="overflow-auto mt-4">
      <table className="border-collapse w-full bg-white">
        <thead>
          <tr>
            {tableHead.map((th) => (
              <th
                key={th}
                className="border border-green-500 bg-green-500 text-white font-medium p-2 uppercase text-sm"
              >
                {th}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {announcements?.map((announcement) => (
            <tr key={announcement.id} className="text-sm text-center">
              <td className="p-2 border border-[#dddddd]">
                {announcement.about}
              </td>
              <td className="p-2 border border-[#dddddd]">
                <Image
                  src={announcement.photo}
                  alt={announcement.about}
                  width={500}
                  height={590}
                  priority
                  className="w-auto h-auto mx-auto"
                />
              </td>
              <td className="p-2 border border-[#dddddd]">
                {dateFormatter.format(announcement.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
