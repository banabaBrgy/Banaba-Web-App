import { db } from "@/lib/db";
import { getUser } from "@/lib/user";
import React from "react";

async function getAccounts() {
  const user = await getUser();
  const accounts = await db.user.findMany({ where: { id: { not: user?.id } } });

  return accounts;
}

export default async function ResidentFilesPage() {
  const accounts = await getAccounts();

  const tableHead = [
    "No.",
    "Fullname",
    "Email Address",
    "Mobile",
    "Sitio/Purok",
    "Gender",
    "Civil Status",
    "Date registered",
    "Option",
  ];

  return (
    <div className="md:px-4 px-3 py-4">
      <h1 className="text-lg uppercase">Accounts</h1>

      <div className="overflow-auto mt-4">
        <table className="border-collapse w-full bg-white">
          <thead>
            <tr>
              {tableHead.map((th, idx) => (
                <th
                  className="border border-[#dddddd] text-start p-2 whitespace-nowrap"
                  key={idx}
                >
                  {th}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {accounts.map((acc, idx) => (
              <tr key={acc.id} className="text-sm">
                <td className="border border-[#dddddd] p-2">{idx + 1}</td>
                <td className="border border-[#dddddd] p-2">{acc.fullName}</td>
                <td className="border border-[#dddddd] p-2">{acc.email}</td>
                <td className="border border-[#dddddd] p-2">
                  {acc.mobile || "N/A"}
                </td>
                <td className="border border-[#dddddd] p-2">
                  {acc.sitioPurok || "N/A"}
                </td>
                <td className="border border-[#dddddd] p-2">
                  {acc.gender || "N/A"}
                </td>
                <td className="border border-[#dddddd] p-2">
                  {acc.civilStatus || "N/A"}
                </td>
                <td className="border border-[#dddddd] p-2">
                  {new Date(acc.createdAt).toLocaleDateString([], {
                    dateStyle: "medium",
                  })}
                </td>
                <td className="border border-[#dddddd] p-2">edit</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
