import { getPrograms } from "@/lib/query/user/programs";
import Image from "next/image";
import React from "react";

export default async function ProgramsPage() {
  const programs = await getPrograms();

  const tableHead = ["About", "Photo", "Uploaded"];

  const dateFormatter = Intl.DateTimeFormat("en-us", {
    dateStyle: "medium",
  });

  return (
    <div className="md:px-4 px-3 py-4">
      <h1 className="font-semibold sm:text-lg text-sm uppercase">Programs</h1>

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
            {programs?.map((program) => (
              <tr key={program.id} className="text-sm text-center">
                <td className="p-2 border border-[#dddddd]">{program.about}</td>
                <td className="p-2 border border-[#dddddd]">
                  <Image
                    src={program.photo}
                    alt={program.about}
                    width={500}
                    height={590}
                    priority
                    className="w-auto h-auto mx-auto"
                  />
                </td>
                <td className="p-2 border border-[#dddddd]">
                  {dateFormatter.format(program.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
