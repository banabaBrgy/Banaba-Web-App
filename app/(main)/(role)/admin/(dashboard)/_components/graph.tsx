"use client";

import React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

const chartConfig = {
  ongoing: {
    label: "Ongoing",
    color: "rgb(37 99 235)",
  },
  request: {
    label: "Request",
    color: "rgb(124 58 237)",
  },
  blotter: {
    label: "Blotter",
    color: "rgb(101 163 13)",
  },
  inquiries: {
    label: "Inquiries",
    color: "rgb(219 39 119)",
  },
} satisfies ChartConfig;

export default function Graph({ totals }: GraphProp) {
  const currentMonthAct = totals.calendarActivities.filter(
    (act) =>
      act.createdAt.getFullYear === new Date().getFullYear &&
      act.createdAt.getMonth() === new Date().getMonth()
  );

  const data = [
    {
      total: currentMonthAct.length,
      name: "Ongoing project(s) (This Month)",
      fill: "var(--color-ongoing)",
    },
    {
      total: totals.totalBlotters.length,
      name: "Total Blotter(s)",
      fill: "var(--color-blotter)",
    },
    {
      total: totals.inquiries.length,
      name: "Total inquirie(s)",
      fill: "var(--color-inquiries)",
    },
    {
      total: totals.totalPendingRequest.length,
      name: "Pending Request",
      fill: "var(--color-request)",
    },
  ];

  return (
    <Card className="mt-5">
      <CardHeader>
        <CardTitle className="md:text-start text-center">
          Bar Chart - Active
        </CardTitle>
        <CardDescription className="md:text-sm text-xs md:text-start text-center">
          Showing total Ongoing Projects, Total Blotters, Total Inquiries, and
          Pending Request
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-[45vh] w-full">
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              className="md:visible invisible"
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="total" strokeWidth={2} radius={5} activeIndex={2} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
