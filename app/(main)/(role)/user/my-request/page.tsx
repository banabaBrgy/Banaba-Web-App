import { getMyRequest } from "@/lib/query/user/my-request";
import React from "react";
import MyRequestRow from "./_components/my-request-row";

export async function generateMetadata() {
  return {
    title: "My Request",
  };
}

export default async function MyRequestPage({
  searchParams,
}: {
  searchParams: { id: string };
}) {
  const { id } = searchParams;
  const myRequest = await getMyRequest();

  return <MyRequestRow myRequest={myRequest} id={id} />;
}
