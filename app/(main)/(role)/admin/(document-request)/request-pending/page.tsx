import { getRequestPending } from "@/lib/query/admin/request-pending";
import React from "react";
import RequestPendingRow from "./_components/request-pending-row";

export async function generateMetadata() {
  return {
    title: "Request Pending",
  };
}

export default async function RequestPendingPage({
  searchParams,
}: {
  searchParams: { id: string };
}) {
  const { id } = searchParams;
  const requestPending = await getRequestPending();

  return (
    <div className="md:px-4 px-3 py-4">
      <RequestPendingRow requestPending={requestPending} id={id} />
    </div>
  );
}
