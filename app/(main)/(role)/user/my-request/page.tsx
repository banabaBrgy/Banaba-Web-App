import { getMyRequest } from "@/lib/query/user/my-request";
import React from "react";
import MyRequestRow from "./_components/my-request-row";

export default async function MyRequestPage() {
  const myRequest = await getMyRequest();

  return <MyRequestRow myRequest={myRequest} />;
}
