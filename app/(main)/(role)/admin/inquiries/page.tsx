import { getInquiries } from "@/lib/query/admin/inquiries";
import React from "react";
import InquiriesRow from "./_components/inquiries-row";

export async function generateMetadata() {
  return {
    title: "Inquiries",
  };
}

export default async function InquiriesPage({
  searchParams,
}: {
  searchParams: { id: string };
}) {
  const { id } = searchParams;
  const inquiries = await getInquiries();

  return (
    <div className="md:px-4 px-3 py-4">
      <InquiriesRow inquiries={inquiries} id={id} />
    </div>
  );
}
