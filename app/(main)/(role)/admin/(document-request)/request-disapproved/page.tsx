import React from "react";
import { RequestDisapprovedRow } from "./_components/request-disapproved-row";
import { getDisapprovedRequest } from "@/lib/query/admin/request-disapproved";

export default async function RequestDisapprovedPage() {
  const disapprovedRequest = await getDisapprovedRequest();

  return (
    <div className="md:px-4 px-3 py-4">
      <RequestDisapprovedRow disapprovedRequests={disapprovedRequest} />
    </div>
  );
}
