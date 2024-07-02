import React from "react";
import InquiriesForm from "./_components/inquiries-form";
import { getUser } from "@/lib/user";

export default async function InquiriesPage() {
  const user = await getUser();

  return (
    <div className="px-4 py-4">
      <h1 className="font-semibold text-lg uppercase">Inquiries</h1>

      <InquiriesForm user={user} />
    </div>
  );
}
