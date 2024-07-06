import React from "react";
import InquiriesForm from "./_components/inquiries-form";
import { getUser } from "@/lib/user";
import { InquiriesRow } from "./_components/inquiries-row";
import { getInquiries } from "@/lib/query/user/inquiries";

export default async function InquiriesPage({
  searchParams,
}: {
  searchParams: { id: string };
}) {
  const { id } = searchParams;
  const user = await getUser();
  const inquiries = await getInquiries();

  return (
    <div className="px-4 py-4">
      <h1 className="font-semibold text-lg uppercase">Inquiries</h1>

      <InquiriesForm user={user} />

      <InquiriesRow inquiries={inquiries} id={id} />
    </div>
  );
}
