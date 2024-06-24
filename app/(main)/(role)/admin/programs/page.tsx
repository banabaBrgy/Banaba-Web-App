import React from "react";
import FormPrograms from "./_components/form-programs";

export default function ProgramsPage() {
  const tableHead = ["No.", "About", "Photo", "Date Posted", "Settings"];

  return (
    <div className="md:px-4 px-3 py-4">
      <h1 className="text-lg font-semibold uppercase">Programs</h1>

      <FormPrograms />

      <div className="overflow-auto mt-4">
        <table className="border-collapse w-full bg-white">
          <thead>
            <tr>
              {tableHead.map((th, idx) => (
                <th
                  key={idx}
                  className="bg-green-500 border border-green-500 p-2 font-medium text-white"
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
