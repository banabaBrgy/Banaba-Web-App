"use client";

import React from "react";

import { Column, ColumnConfig } from "@ant-design/charts";
import {
  Blotter,
  CalendarOfActivities,
  DocumentRequest,
  Inquiries,
} from "@prisma/client";

type GraphProp = {
  totals: {
    totalPendingRequest: DocumentRequest[];
    totalBlotters: Blotter[];
    inquiries: Inquiries[];
    calendarActivities: CalendarOfActivities[];
  };
};

export default function Graph({ totals }: GraphProp) {
  const currentMonthAct = totals.calendarActivities.filter(
    (act) =>
      act.createdAt.getFullYear === new Date().getFullYear &&
      act.createdAt.getMonth() === new Date().getMonth()
  );

  const data = [
    {
      total: currentMonthAct.length,
      name: "Register Voter(s)",
    },
    {
      total: totals.totalBlotters.length,
      name: "Total Blotter(s)",
    },
    {
      total: totals.inquiries.length,
      name: "Total inquirie(s)",
    },
    {
      total: totals.totalPendingRequest.length,
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
