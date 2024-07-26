import React from "react";
import FormPrograms from "./_components/form-programs";
import ProgramsRow from "./_components/programs-row";
import { getPrograms } from "@/lib/query/admin/programs";

export async function generateMetadata() {
  return {
    title: "Programs",
  };
}

export default async function ProgramsPage() {
  const programs = await getPrograms();

  return (
    <div className="md:px-4 px-3 py-4">
      <div>
        <h1 className="text-lg font-semibold uppercase">Create programs</h1>
        <FormPrograms />
      </div>

      <div className="mt-4 space-y-4">
        <ProgramsRow programs={programs} />
      </div>
    </div>
  );
}
