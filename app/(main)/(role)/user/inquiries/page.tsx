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
      <div>
        <h1 className="sm:text-lg text-sm font-semibold uppercase">
          Create Inquiries
        </h1>

        <InquiriesForm user={user} />
      </div>

      <InquiriesRow inquiries={inquiries} id={id} />
    </div>
  );
}
