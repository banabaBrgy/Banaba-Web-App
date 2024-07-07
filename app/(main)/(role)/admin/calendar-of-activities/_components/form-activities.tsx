"use client";

import { createActivities } from "@/action/admin/calendar-of-activities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import React, { ElementRef, useRef, useTransition } from "react";
import { toast } from "sonner";

export default function FormActivities() {
  const [pending, setTransition] = useTransition();
  const calendarActivitiesForm = useRef<ElementRef<"form">>(null);

  function onCreateCalendarActivities(formData: FormData) {
    setTransition(async () => {
      await createActivities(formData)
        .then(() => {
          toast.success("Created successfully");
          calendarActivitiesForm.current?.reset();
        })
        .catch(() => toast.error("Something went wrong"));
    });
  }

  return (
    <form
      action={onCreateCalendarActivities}
      ref={calendarActivitiesForm}
      className="space-y-2 mt-3"
    >
      <div className="space-y-2">
        <label htmlFor="event" className="text-sm">
          Event
        </label>
        <Input
          type="text"
          name="event"
          id="event"
          required
          placeholder="Enter Event"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm">
          Description
        </label>
        <Textarea
          rows={3}
          placeholder="Enter description"
          id="description"
          required
          name="description"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-3">
        <div className="space-y-2">
          <label htmlFor="startDate" className="text-sm">
            Start date
          </label>

          <Input
            type="datetime-local"
            id="startDate"
            name="startDate"
            required
            placeholder="Enter start date"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="endDate" className="text-sm">
            End date
          </label>

          <Input
            type="datetime-local"
            id="endDate"
            name="endDate"
            required
            placeholder="Enter end date"
          />
        </div>
      </div>

      <Button
        disabled={pending}
        type="submit"
        variant="outline"
        className="w-full"
      >
        {pending ? (
          <Loader2 className="animate-spin" />
        ) : (
          " Create announcement"
        )}
      </Button>
    </form>
  );
}
