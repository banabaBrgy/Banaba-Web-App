import { getBlotters } from "@/lib/query/admin/blotter";
import React from "react";
import BlotterRow from "./_components/blotter-row";

export default async function BlotterPage({
  searchParams,
}: {
  searchParams: { id: string };
}) {
  const { id } = searchParams;
  const blotters = await getBlotters();

  return (
    <div className="md:px-4 px-3 py-4">
      <BlotterRow blotters={blotters} id={id} />
    </div>
  );
}
