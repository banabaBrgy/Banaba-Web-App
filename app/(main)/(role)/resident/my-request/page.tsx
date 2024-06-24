import { getMyRequest } from "@/lib/query/resident/my-request";
import React from "react";
import MyRequestRow from "./_components/my-request-row";

export default async function MyRequestPage() {
  const myRequest = await getMyRequest();
  const tableHead = [
    "No.",
    "Control No.",
    "Document Type",
    "Date Requested",
    "Purposes",
    "Issued by",
    "Date issued",
    "Status",
  ];

  return <MyRequestRow tableHead={tableHead} myRequest={myRequest} />;
}
