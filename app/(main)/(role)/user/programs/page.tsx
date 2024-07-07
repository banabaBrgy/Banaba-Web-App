import { getPrograms } from "@/lib/query/user/programs";
import React from "react";
import ProgramsRow from "./_components/programs-row";

export default async function ProgramsPage() {
  const programs = await getPrograms();

  return (
    <div className="md:px-4 px-3 py-4">
      <h1 className="font-semibold sm:text-lg text-sm uppercase">Programs</h1>

      <ProgramsRow programs={programs} />
    </div>
  );
}
