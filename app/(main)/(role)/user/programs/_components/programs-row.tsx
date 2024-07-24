"use client";

import { markProgramsAsRead } from "@/action/user/programs";
import { Programs } from "@prisma/client";
import Image from "next/image";
import React, { useEffect } from "react";

interface ProgramsRowProp {
  programs: Programs[] | undefined;
}

export default function ProgramsRow({ programs }: ProgramsRowProp) {
  const tableHead = ["About", "Photo", "Uploaded"];

  const dateFormatter = Intl.DateTimeFormat("en-us", {
    dateStyle: "medium",
  });

  useEffect(() => {
    markProgramsAsRead();
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
          {programs?.map((program) => (
            <tr key={program.id} className="text-sm text-center">
              <td className="p-2 border border-[#dddddd] max-w-[15rem]">
                {program.about}
              </td>
              <td className="p-2 border border-[#dddddd]">
                <Image
                  src={program.photo}
                  alt={program.about}
                  width={500}
                  height={590}
                  priority
                  className="w-auto h-auto max-w-[35rem] mx-auto"
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
  );
}
