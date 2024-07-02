import React from "react";
import FormActivities from "./_components/form-activities";
import CalendarOfActivitiesRow from "./_components/calendar-of-activities-row";
import { getCalendarActivities } from "@/lib/query/admin/calendar-of-activities";

export default async function CalendarOfActivitiesPage() {
  const calendarActivities = await getCalendarActivities();

  return (
    <div className="md:px-4 px-3 py-4">
      <div>
        <h1 className="font-semibold text-lg uppercase">Create Activities</h1>
        <FormActivities />
      </div>

      <div className="mt-4 space-y-4">
        <CalendarOfActivitiesRow calendarActivities={calendarActivities} />
      </div>
    </div>
  );
}
