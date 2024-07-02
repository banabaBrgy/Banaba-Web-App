import React from "react";
import ServicesForm from "./_components/services-form";
import { getDocumentType } from "@/lib/query/user/services";
import { getUser } from "@/lib/user";

export default async function ServicesPage() {
  const user = await getUser();
  const documentTypes = await getDocumentType();

  return (
    <div className="px-4 py-4">
      <h1 className="font-semibold text-lg uppercase">Services</h1>

      <ServicesForm documentTypes={documentTypes} user={user} />
    </div>
  );
}
