import { getServices } from "@/lib/query/admin/services";
import React from "react";
import ServicesRow from "./_components/services-row";

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="md:px-4 px-3 py-4">
      <ServicesRow services={services} />
    </div>
  );
}
