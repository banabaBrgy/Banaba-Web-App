import React from "react";

export default function MyRequestPage() {
  const tableHead = [
    "No.",
    "Control No.",
    "Document Type",
    "Requested by",
    "Date Requested",
    "Purposes",
    "Issued by",
    "Date issued",
    "Status",
  ];

  const tableBody = [
    {
      no: 1,
      controlNo: "clwge3p2i0000cxk58bp5quxs",
      documentType: "Files",
      requestedBy: "Hernandez",
      dateRequested: "20/5/2024",
      purposes: "wala lang",
      issuedBy: "john",
      dateIssued: "28/5/2024",
      status: "approved",
    },
    {
      no: 2,
      controlNo: "clwge3p2i0000cxk58bp5quxs",
      documentType: "Files",
      requestedBy: "Hernandez",
      dateRequested: "20/5/2024",
      purposes: "wala lang",
      issuedBy: "john",
      dateIssued: "28/5/2024",
      status: "approved",
    },
  ];

  return (
    <div className="px-4 py-4">
      <h1 className="text-lg uppercase">My Request</h1>

      <div className="overflow-auto  mt-4">
        <table className="border-collapse w-full bg-white">
          <thead>
            <tr>
              {tableHead.map((th) => (
                <th
                  className="border border-[#dddddd] text-start p-2 whitespace-nowrap"
                  key={th}
                >
                  {th}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {tableBody.map((item, idx) => (
              <tr key={idx} className="odd:bg-[#dddddd] text-sm">
                <td className="border border-[#dddddd] p-2 font-semibold">
                  {item.no}.
                </td>
                <td className="border border-[#dddddd] p-2">
                  {item.controlNo}
                </td>
                <td className="border border-[#dddddd] p-2">
                  {item.documentType}
                </td>
                <td className="border border-[#dddddd] p-2">
                  {item.requestedBy}
                </td>
                <td className="border border-[#dddddd] p-2">
                  {item.dateRequested}
                </td>
                <td className="border border-[#dddddd] p-2">{item.purposes}</td>
                <td className="border border-[#dddddd] p-2">{item.issuedBy}</td>
                <td className="border border-[#dddddd] p-2">
                  {item.dateIssued}
                </td>
                <td className="border border-[#dddddd] p-2 text-green-600 font-semibold">
                  {item.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
