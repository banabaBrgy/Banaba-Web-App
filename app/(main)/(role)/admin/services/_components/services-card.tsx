import { DocumentRequest, DocumentType } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import axios from "axios";

interface ServicesCardProp {
  service: DocumentType;
  idx: number;
}

export default function ServicesCard({ service, idx }: ServicesCardProp) {
  const { data: totalApprovedRequest } = useQuery({
    queryKey: ["total-approved-request", service.document],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `/api/admin/services/total-approved-request?documentType=${service.document}`
        );

        return res.data as DocumentRequest[];
      } catch (error: any) {
        console.log(error.message);
      }
    },
  });

  const { data: totalPendingRequest } = useQuery({
    queryKey: ["total-pending-request", service.document],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `/api/admin/services/total-pending-request?documentType=${service.document}`
        );

        return res.data as DocumentRequest[];
      } catch (error: any) {
        console.log(error.message);
      }
    },
  });

  return (
    <tr className="text-center text-sm hover:bg-zinc-50">
      <td className="border border-[#dddddd] p-2">{idx + 1}.</td>
      <td className="border border-[#dddddd] p-2">{service.document}</td>
      <td className="border border-[#dddddd] p-2">
        {totalApprovedRequest?.length}
      </td>
      <td className="border border-[#dddddd] p-2">
        {totalPendingRequest?.length}
      </td>
    </tr>
  );
}
