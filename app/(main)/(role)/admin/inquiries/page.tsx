import { getInquiries } from "@/lib/query/admin/inquiries";
import React from "react";
import InquiriesRow from "./_components/inquiries-row";

export default async function InquiriesPage() {
  const inquiries = await getInquiries();

  return (
    <div className="md:px-4 px-3 py-4">
      <InquiriesRow inquiries={inquiries} />
    </div>
  );
}
