"use client";

import React from "react";

import { Column, ColumnConfig } from "@ant-design/charts";

export default function Graph() {
  const data = [
    {
      total: 59,
      name: "Register Voter(s)",
    },
    {
      total: 300,
      name: "Total Blotter(s)",
    },
    {
      total: 1334,
      name: "Total Resident(s)",
    },
    {
      total: 100,
      name: "Pending Request",
    },
  ];

  const config: ColumnConfig = {
    data,
    xField: "name",
    yField: "total",
    colorField: "name",
  };

  return (
    <Column {...config} className="min-h-[50dvh] mt-4 bg-white rounded-md" />
  );
}
