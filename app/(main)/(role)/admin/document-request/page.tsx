import React from "react";

export default function DocumentRequestPage() {
  const documentRequest = [
    "No.",
    "Contact No",
    "Document Type",
    "Requested By",
    "Date Requested",
    "Purposes",
    "Issued By",
    "Date Issued",
    "Status",
  ];

  return (
    <div className="md:px-4 px-3 py-4">
      <h1 className="text-lg uppercase">Document Request</h1>

      <div className="overflow-auto mt-4">
        <table className="border-collapse w-full bg-white">
          <thead>
            <tr>
              {documentRequest.map((th, idx) => (
                <th
                  key={idx}
                  className="border border-[#dddddd] p-2 text-start"
                >
                  {th}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
