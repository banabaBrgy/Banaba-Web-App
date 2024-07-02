import { getRequestPending } from "@/lib/query/admin/request-pending";
import React from "react";
import RequestPendingRow from "./_components/request-pending-row";

export default async function RequestPendingPage() {
  const requestPending = await getRequestPending();

  return (
    <div className="md:px-4 px-3 py-4">
      <RequestPendingRow requestPending={requestPending} />
    </div>
  );
}
