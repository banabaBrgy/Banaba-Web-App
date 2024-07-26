"use client";

import React, {
  ElementRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { Calendar, momentLocalizer, SlotInfo, View } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  createCalendarActivities,
  deleteCalendarActivities,
  editCalendarActivities,
} from "@/action/admin/dashboard";
import { toast } from "sonner";
import { X } from "lucide-react";

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

interface CreateActivitiesType {
  start: string;
  end: string;
}

interface EditActivities {
  id: string;
  event: string;
  description: string;
  startDate: string;
  endDate: string;
}

export function ReactBigCalendar({ calendarActivities }: ReactBigCalendarProp) {
  const [pending, setTransition] = useTransition();
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<ViewType>("month");
  const [createActivities, setCreateActivities] =
    useState<CreateActivitiesType | null>(null);
  const [editActivities, setEditActivities] = useState<EditActivities | null>(
    null
  );
  const createActivitiesFormRef = useRef<ElementRef<"form">>(null);
  const editActivitiesFormRef = useRef<ElementRef<"form">>(null);

  const events = calendarActivities?.map((ev) => ({
    id: ev.id,
    title: ev.event,
    description: ev.description,
    start: new Date(ev.startDate),
    end: new Date(ev.endDate),
  }));

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        !createActivitiesFormRef.current?.contains(e.target as any) &&
        !editActivitiesFormRef.current?.contains(e.target as any)
      ) {
        setCreateActivities(null);
        setEditActivities(null);
      }
    };

    window.addEventListener("click", handleClick);

    return () => window.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    if (editActivities || createActivities) {
      document.body.style.overflow = "clip";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [editActivities, createActivities]);

  const onView = useCallback((newView: View) => setView(newView), [setView]);
  const onNavigate = useCallback((date: Date) => setDate(date), [setDate]);
  const onSelectSlotInfo = useCallback(
    (e: SlotInfo) =>
      setCreateActivities({
        start: moment(e.start).format("YYYY-MM-DDTHH:mm"),
        end: moment(e.end).format("YYYY-MM-DDTHH:mm"),
      }),
    [setCreateActivities]
  );
  const onSelectEvent = useCallback(
    (e: any) =>
      setEditActivities({
        id: e.id,
        event: e.title,
        description: e.description,
        startDate: moment(e.start).format("YYYY-MM-DDTHH:mm"),
        endDate: moment(e.end).format("YYYY-MM-DDTHH:mm"),
      }),
    [setEditActivities]
  );

  const onCreateActivities = (formData: FormData) => {
    setTransition(async () => {
      createCalendarActivities(formData)
        .then(() => {
          setCreateActivities(null);
          toast.success("Added new activities");
        })
        .catch(() => toast.error("Something went wrong"));
    });
  };

  const onEditActivities = (formData: FormData) => {
    setTransition(async () => {
      await editCalendarActivities(formData, editActivities?.id)
        .then(() => {
          toast.success("Edited activities");
          setEditActivities(null);
        })
        .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 flex justify-center bg-black/50 z-[1001] duration-200",
          createActivities ? "visible opacity-100" : "invisible opacity-0"
        )}
      >
        <form
          action={onCreateActivities}
          key={createActivities?.start}
          ref={createActivitiesFormRef}
          className={cn(
            "relative p-4 rounded-md bg-white mb-auto mt-10 flex-1 max-w-[45rem] mx-3 duration-200",
            createActivities ? "visible scale-100" : "invisible scale-95"
          )}
        >
          <button
            onClick={() => setCreateActivities(null)}
            type="button"
            title="Close"
            className="absolute right-2 top-2 p-1 rounded-full hover:bg-zinc-100"
          >
            <X size={18} className="text-zinc-500" />
          </button>

          <h1 className="text-lg font-bold uppercase mb-4">
            Create Activities
          </h1>

          <div>
            <div>
              <label htmlFor="event" className="text-sm">
                Event
              </label>
              <Input
                type="text"
                autoFocus
                required
                placeholder="Enter event"
                name="event"
                id="event"
                className="mt-2 border-zinc-300"
              />
            </div>
            <div className="mt-2">
              <label htmlFor="description" className="text-sm">
                Description
              </label>
              <Textarea
                rows={4}
                placeholder="Enter description"
                required
                name="description"
                id="description"
                className="mt-2 border-zinc-300"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              <div>
                <label htmlFor="startDate" className="text-sm">
                  Start date
                </label>
                <Input
                  type="datetime-local"
                  required
                  defaultValue={createActivities?.start}
                  name="startDate"
                  id="startDate"
                  className="mt-2 border-zinc-300"
                />
              </div>

              <div>
                <label htmlFor="startDate" className="text-sm">
                  End date
                </label>
                <Input
                  type="datetime-local"
                  required
                  defaultValue={createActivities?.end}
                  name="endDate"
                  id="endDate"
                  className="mt-2 border-zinc-300"
                />
              </div>
            </div>

            <div className="flex mt-4 gap-2">
              <Button type="submit" disabled={pending} className="flex-1">
                Create
              </Button>
            </div>
          </div>
        </form>
      </div>

      <div
        className={cn(
          "fixed inset-0 flex justify-center bg-black/50 z-[1001] duration-200",
          editActivities ? "visible opacity-100" : "invisible opacity-0"
        )}
      >
        <form
          action={onEditActivities}
          key={editActivities?.id}
          ref={editActivitiesFormRef}
          className={cn(
            "relative p-4 rounded-md bg-white mb-auto mt-10 flex-1 max-w-[45rem] mx-3 duration-200",
            editActivities ? "visible scale-100" : "invisible scale-95"
          )}
        >
          <button
            onClick={() => setEditActivities(null)}
            type="button"
            title="Close"
            className="absolute right-2 top-2 p-1 rounded-full hover:bg-zinc-100"
          >
            <X size={18} className="text-zinc-500" />
          </button>

          <h1 className="text-lg font-bold uppercase mb-4">Edit Activity</h1>

          <div>
            <div>
              <label htmlFor="event" className="text-sm">
                Event
              </label>
              <Input
                type="text"
                autoFocus
                required
                placeholder="Enter event"
                defaultValue={editActivities?.event}
                name="event"
                id="event"
                className="mt-2 border-zinc-300"
              />
            </div>
            <div className="mt-2">
              <label htmlFor="description" className="text-sm">
                Description
              </label>
              <Textarea
                rows={4}
                placeholder="Enter description"
                required
                defaultValue={editActivities?.description}
                name="description"
                id="description"
                className="mt-2 border-zinc-300"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              <div>
                <label htmlFor="startDate" className="text-sm">
                  Start date
                </label>
                <Input
                  type="datetime-local"
                  required
                  defaultValue={editActivities?.startDate}
                  name="startDate"
                  id="startDate"
                  className="mt-2 border-zinc-300"
                />
              </div>

              <div>
                <label htmlFor="startDate" className="text-sm">
                  End date
                </label>
                <Input
                  type="datetime-local"
                  required
                  defaultValue={editActivities?.endDate}
                  name="endDate"
                  id="endDate"
                  className="mt-2 border-zinc-300"
                />
              </div>
            </div>

            <div className="flex mt-4 gap-2">
              <Button
                onClick={() =>
                  setTransition(async () => {
                    deleteCalendarActivities(editActivities?.id)
                      .then(() => {
                        toast.success("Deleted successfully");
                        setEditActivities(null);
                      })
                      .catch(() => toast.error("Something went wrong"));
                  })
                }
                disabled={pending}
                type="button"
                className="flex-1"
                variant="destructive"
              >
                Delete
              </Button>
              <Button type="submit" disabled={pending} className="flex-1">
                Edit
              </Button>
            </div>
          </div>
        </form>
      </div>

      <Card className="mt-5" onClick={(e) => e.stopPropagation()}>
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
          <CardDescription>Calendar of activities</CardDescription>
        </CardHeader>

        <CardContent>
          <Calendar
            style={{ height: 550 }}
            localizer={localizer}
            events={events}
            views={["month", "week", "day", "agenda"]}
            date={date}
            view={view}
            popup
            selectable
            onSelectSlot={onSelectSlotInfo}
            onSelectEvent={onSelectEvent}
            onView={onView}
            onNavigate={onNavigate}
          />
        </CardContent>
      </Card>
    </>
  );
}
