import { getRequestApproved } from "@/lib/query/admin/request-approved";
import React from "react";
import RequestApprovedRow from "./_components/request-approved-row";

export default async function RequestApprovePage() {
  const requestApproved = await getRequestApproved();

  return (
    <div className="md:px-4 px-3 py-4">
      <RequestApprovedRow requestApproved={requestApproved} />
    </div>
  );
}
