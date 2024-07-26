import React from "react";
import { getCalendarActivities } from "@/lib/query/user/dashboard";
import { ReactBigCalendar } from "./_components/react-big-calendar";

export async function generateMetadata() {
  return {
    title: "Dashboard",
  };
}

export default async function ResidentPage() {
  const calendarActivities = await getCalendarActivities();

  return (
    <div className="md:px-4 px-3 py-4">
      <ReactBigCalendar calendarActivities={calendarActivities} />
    </div>
  );
}
