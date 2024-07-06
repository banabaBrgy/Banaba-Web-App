import { getAnnouncement } from "@/lib/query/user/announcement";
import Image from "next/image";
import React from "react";

export default async function AnnouncementPage() {
  const announcements = await getAnnouncement();

  const tableHead = ["About", "Photo", "Uploaded"];

  const dateFormatter = Intl.DateTimeFormat("en-us", {
    dateStyle: "medium",
  });

  return (
    <div className="md:px-4 px-3 py-4">
      <h1 className="font-semibold sm:text-lg text-sm uppercase">
        Announcement
      </h1>

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
    </div>
  );
}
