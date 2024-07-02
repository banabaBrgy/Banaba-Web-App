"use client";

import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface ReactBigCalendarProp {
  calendarActivities:
    | {
        id: string;
        event: string;
        description: string;
        startDate: string;
        endDate: string;
        createdAt: Date;
        updatedAt: Date;
      }[]
    | undefined;
}

type ViewType = "month" | "week" | "work_week" | "day" | "agenda";

const localizer = momentLocalizer(moment);

export default function ReactBigCalendar({
  calendarActivities,
}: ReactBigCalendarProp) {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<ViewType>("month");

  const events = calendarActivities?.map((ev) => ({
    title: ev.event,
    start: new Date(ev.startDate),
    end: new Date(ev.endDate),
  }));

  return (
    <Card className="mt-5">
      <CardHeader>
        <CardTitle>Calendar</CardTitle>
        <CardDescription>Calendar holiday events</CardDescription>
      </CardHeader>

      <CardContent>
        <Calendar
          localizer={localizer}
          events={events}
          views={["month", "week", "day", "agenda"]}
          date={date}
          defaultDate={date}
          view={view}
          defaultView={view}
          style={{ height: 550 }}
          onView={(view) => setView(view)}
          onNavigate={(date) => setDate(date)}
        />
      </CardContent>
    </Card>
  );
}
