"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { MdOutlineSearch } from "react-icons/md";
import { DocumentType } from "@prisma/client";
import ServicesCard from "./services-card";

type ServicesRowProp = {
  services: DocumentType[] | undefined;
};

export default function ServicesRow({ services }: ServicesRowProp) {
  const [search, setSearch] = useState("");

  const tableHead = [
    "No.",
    "Document type",
    "Total approved request",
    "Total disapproved request",
    "Total Pending Request",
  ];

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-lg uppercase">Services</h1>

        <div className="relative flex items-center flex-1 max-w-[20rem]">
          <MdOutlineSearch className="absolute right-3 scale-[1.4] text-zinc-400" />
          <Input
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Search"
            className="pr-10"
          />
        </div>
      </div>

      <div className="overflow-auto mt-4">
        <table className="border-collapse w-full bg-white">
          <thead>
            <tr>
              {tableHead.map((th, idx) => (
                <th
                  key={idx}
                  className="border border-green-500 bg-green-500 p-2 text-white font-normal uppercase text-sm whitespace-nowrap"
                >
                  {th}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {services
              ?.filter((service) =>
                service.document.toLowerCase().includes(search)
              )
              ?.map((service, idx) => (
                <ServicesCard key={service.id} service={service} idx={idx} />
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
