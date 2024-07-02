import { getPrograms } from "@/lib/query/user/programs";
import Image from "next/image";
import React from "react";

export default async function ProgramsPage() {
  const programs = await getPrograms();

  return (
    <div className="md:px-4 px-3 py-4">
      <h1 className="font-semibold text-lg uppercase">Programs</h1>

      <div className="flex flex-col items-center gap-4">
        {programs?.map((program) => (
          <div key={program.id}>
            <Image
              src={program.photo}
              alt={program.about}
              width={600}
              height={500}
              priority
              className="h-auto w-auto"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
