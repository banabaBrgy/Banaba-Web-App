import React from "react";

export default async function AnnouncementPage() {
  const tableHead = ["No.", "About", "Photo", "Date Posted", "Settings"];

  return (
    <div className="md:px-4 px-3 py-4">
      <h1 className="text-lg uppercase">Announcement</h1>

      <div className="overflow-auto mt-4">
        <table className="border-collapse w-full bg-white">
          <thead>
            <tr>
              {tableHead.map((th, idx) => (
                <th
                  key={idx}
                  className="border border-[#dddddd] p-2 text-start"
                >
                  {th}
                </th>
              ))}
            </tr>
          </thead>
        </table>
      </div>
    </div>
  );
}
