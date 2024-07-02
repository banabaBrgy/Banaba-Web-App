import React from "react";
import DocumentTypeRow from "./_components/document-type-row";
import { getDocumentType } from "@/lib/query/admin/document-type";

export default async function DocumentTypePage() {
  const documentTypes = await getDocumentType();

  return (
    <div className="md:px-4 px-3 py-4">
      <DocumentTypeRow documentTypes={documentTypes} />
    </div>
  );
}
