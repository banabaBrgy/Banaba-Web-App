"use client";

import { CalendarOfActivities } from "@prisma/client";

import { Calendar, momentLocalizer, View } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCallback, useState } from "react";

interface ReactBigCalendarProp {
  calendarActivities: CalendarOfActivities[] | undefined;
}

type ViewType = "month" | "week" | "work_week" | "day" | "agenda";

const localizer = momentLocalizer(moment);

export const ReactBigCalendar = ({
  calendarActivities,
}: ReactBigCalendarProp) => {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<ViewType>("month");

  const eventLists = calendarActivities?.map((cal) => ({
    title: cal.event,
    start: new Date(cal.startDate),
    end: new Date(cal.endDate),
    resource: cal.description,
  }));

  const onView = useCallback((newView: View) => setView(newView), [setView]);
  const onNavigate = useCallback((date: Date) => setDate(date), [setDate]);

  return (
    <Card>
      <CardHeader className="md:px-6 px-2">
        <CardTitle>Calendar</CardTitle>
        <CardDescription>Calendar of activities</CardDescription>
      </CardHeader>

      <CardContent className="md:px-6 px-2">
        <Calendar
          localizer={localizer}
          events={eventLists}
          views={["month", "week", "day", "agenda"]}
          date={date}
          view={view}
          startAccessor="start"
          endAccessor="end"
          popup
          style={{ height: 540 }}
          onView={onView}
          onNavigate={onNavigate}
        />
      </CardContent>
    </Card>
  );
};
