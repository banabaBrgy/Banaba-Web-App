import React from "react";

export default function InquiriesPage() {
  const tableHead = [
    "No.",
    "Fullname",
    "Email address",
    "Mobile",
    "Subject",
    "Message",
    "Date registered",
    "Option",
  ];

  return (
    <div className="md:px-4 px-3 py-4">
      <h1 className="text-lg uppercase">Inquiries</h1>

      <div className="overflow-auto mt-4">
        <table className="border-collapse bg-white w-full">
          <thead>
            <tr>
              {tableHead.map((th, idx) => (
                <th className="border border-[#dddddd] p-2" key={idx}>
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
