import React from "react";
import { RequestArchivedRow } from "./_components/request-archived-row";
import { getRequestArchived } from "@/lib/query/admin/request-archived";

export async function generateMetadata() {
  return {
    title: "Request Archived",
  };
}

const RequestArchivedPage = async () => {
  const requestArchiveds = await getRequestArchived();

  return (
    <div className="md:px-4 px-3 py-4">
      <RequestArchivedRow requestArchiveds={requestArchiveds} />
    </div>
  );
};

export default RequestArchivedPage;
