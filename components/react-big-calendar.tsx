"use client";

import React, { useEffect, useState } from "react";
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
import axios from "axios";

interface EventsType {
  date: string;
  end: string;
  name: string;
  rule: string;
  start: string;
  type: string;
}

type ViewType = "month" | "week" | "work_week" | "day" | "agenda";

const localizer = momentLocalizer(moment);

export default function ReactBigCalendar() {
  const [events, setEvents] = useState<EventsType[]>([]);
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<ViewType>("month");

  useEffect(() => {
    const options = {
      method: "GET",
      url: "https://worldwide-national-holidays.p.rapidapi.com/getholidays",
      params: { country: "ph" },
      headers: {
        "x-rapidapi-key": "c8232416e8msh7be206ef73b6fe4p189c19jsndefa2d96c6a9",
        "x-rapidapi-host": "worldwide-national-holidays.p.rapidapi.com",
      },
    };

    const getAllEvents = async () => {
      try {
        const res = await axios.request(options);
        setEvents(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    getAllEvents();
  }, []);

  const myEventsList = events?.map(({ name, date }, i) => ({
    title: name,
    start: new Date(date),
    end: new Date(date),
  }));

  const dates = new Date("2024-01-01").getTime() + 3600 * 1000;

  const customEvents = [
    {
      title: "New Year",
      start: new Date("2024-01-01"),
      end: new Date(dates),
    },
  ];

  return (
    <Card className="mt-5">
      <CardHeader>
        <CardTitle>Calendar</CardTitle>
        <CardDescription>Calendar holiday events</CardDescription>
      </CardHeader>

      <CardContent>
        <Calendar
          localizer={localizer}
          events={customEvents}
          views={["month", "week", "day", "agenda"]}
          date={date}
          defaultDate={date}
          view={view}
          defaultView={view}
          style={{ height: 500 }}
          onView={(view) => setView(view)}
          onNavigate={(date) => setDate(date)}
        />
      </CardContent>
    </Card>
  );
}
