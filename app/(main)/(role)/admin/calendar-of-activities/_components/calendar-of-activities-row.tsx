"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarOfActivities } from "@prisma/client";
import React, { useState, useTransition } from "react";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { MdEdit, MdOutlineSearch } from "react-icons/md";
import { IoIosSave } from "react-icons/io";
import {
  deleteCalendarActivities,
  editCalendarOfActivities,
} from "@/action/admin/calendar-of-activities";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CalendarOfActivitiesRowProp {
  calendarActivities: CalendarOfActivities[] | undefined;
}

export default function CalendarOfActivitiesRow({
  calendarActivities,
}: CalendarOfActivitiesRowProp) {
  const [pending, setTransition] = useTransition();
  const [edit, setEdit] = useState<CalendarOfActivities | null>(null);
  const [del, setDelete] = useState("");
  const [search, setSearch] = useState("");

  const tableHead = ["No", "Event", "Description", "Date-Time", "Option"];

  const dateFormatter = Intl.DateTimeFormat("en-us", {
    dateStyle: "medium",
  });

  const timeFormatter = Intl.DateTimeFormat("en-us", {
    timeStyle: "short",
  });

  function onSaveEdit() {
    setTransition(async () => {
      await editCalendarOfActivities(edit)
        .then(() => {
          toast.success("Edited successfully");
          setEdit(null);
        })
        .catch(() => toast.error("Something went wrong"));
    });
  }

  function onDeleteCalendarAct() {
    setTransition(async () => {
      await deleteCalendarActivities(del)
        .then(() => {
          toast.success("Deleted successfully");
          setDelete("");
        })
        .catch(() => toast.error("Something went wrong"));
    });
  }

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 bg-black/80 flex items-center justify-center z-[1002] duration-100",
          del ? "opacity-100 visible" : "opacity-0 invisible"
        )}
      >
        <div
          className={cn(
            "space-y-4 bg-white p-7 md:rounded-lg max-w-[31rem] duration-200",
            del ? "scale-100 visible" : "scale-95 invisible"
          )}
        >
          <div className="space-y-3">
            <h1 className="font-semibold text-lg">Delete Activity</h1>
            <p className="text-sm text-gray-500">
              This action cannot be undone. This will permanentlty delete this
              activity.
            </p>
          </div>

          <div className="flex md:flex-row flex-col justify-end gap-2">
            <Button onClick={() => setDelete("")} variant="outline">
              Cancel
            </Button>
            <Button onClick={onDeleteCalendarAct} disabled={pending}>
              Continue
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-lg uppercase">
          Calendar of Activities
        </h1>

        <div className="relative flex items-center flex-1 max-w-[20rem]">
          <MdOutlineSearch className="absolute right-3 scale-[1.4] text-zinc-400" />
          <Input
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            value={search}
            placeholder="Search"
            className="pr-10"
          />
        </div>
      </div>

      <div className="overflow-auto mt-4">
        <table className="border-collapse w-full bg-white">
          <thead>
            <tr>
              {tableHead.map((th, idx) => (
                <th
                  key={idx}
                  className="border border-green-500 bg-green-500 p-2 text-white font-normal text-sm uppercase whitespace-nowrap"
                >
                  {th}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {calendarActivities
              ?.filter(
                (act) =>
                  act.event.toLowerCase().includes(search) ||
                  act.description.toLowerCase().includes(search)
              )
              ?.map((act, idx) => (
                <tr
                  key={act.id}
                  className="text-center text-sm hover:bg-zinc-50"
                >
                  <td className="border border-[#dddddd] p-2">{idx + 1}.</td>
                  <td className="border border-[#dddddd] p-2">
                    {edit?.id === act.id ? (
                      <Input
                        onChange={({ target: { value } }) =>
                          setEdit(
                            (prev) =>
                              ({
                                ...prev,
                                event: value,
                              } as CalendarOfActivities)
                          )
                        }
                        type="text"
                        defaultValue={act.event}
                      />
                    ) : (
                      act.event
                    )}
                  </td>
                  <td className="border border-[#dddddd] p-2">
                    {edit?.id === act.id ? (
                      <Input
                        onChange={({ target: { value } }) =>
                          setEdit(
                            (prev) =>
                              ({
                                ...prev,
                                description: value,
                              } as CalendarOfActivities)
                          )
                        }
                        type="text"
                        defaultValue={act.description}
                      />
                    ) : (
                      act.description
                    )}
                  </td>
                  <td className="space-y-2 border border-[#dddddd] p-2">
                    <div className="space-y-1">
                      {act.id === edit?.id ? (
                        <>
                          <p className="text-start">Start date</p>
                          <Input
                            onChange={({ target: { value } }) =>
                              setEdit(
                                (prev) =>
                                  ({
                                    ...prev,
                                    startDate: value,
                                  } as CalendarOfActivities)
                              )
                            }
                            type="datetime-local"
                          />
                        </>
                      ) : (
                        <>
                          {dateFormatter.format(new Date(act.startDate))} -{" "}
                          {dateFormatter.format(new Date(act.endDate))}
                        </>
                      )}
                    </div>
                    <div className="space-y-1">
                      {edit?.id === act.id ? (
                        <>
                          <p className="text-start">End date</p>
                          <Input
                            onChange={({ target: { value } }) =>
                              setEdit(
                                (prev) =>
                                  ({
                                    ...prev,
                                    endDate: value,
                                  } as CalendarOfActivities)
                              )
                            }
                            type="datetime-local"
                          />
                        </>
                      ) : (
                        <>
                          {timeFormatter.format(new Date(act.startDate))} -{" "}
                          {timeFormatter.format(new Date(act.endDate))}
                        </>
                      )}
                    </div>
                  </td>
                  <td className="space-y-1 space-x-1 border w-40 border-[#dddddd] p-2">
                    <Button
                      onClick={() =>
                        setEdit((prev) => (prev?.id === act.id ? null : act))
                      }
                      variant="outline"
                      size="sm"
                      className="shadow-md"
                    >
                      <MdEdit className="scale-[1.3]" />
                    </Button>
                    <Button
                      onClick={onSaveEdit}
                      variant="outline"
                      size="sm"
                      disabled={
                        pending ||
                        edit?.id !== act.id ||
                        (edit?.event === act.event &&
                          edit?.description === act.description &&
                          edit?.startDate === act.startDate &&
                          edit?.endDate === act.endDate)
                      }
                      className="shadow-md"
                    >
                      <IoIosSave className="scale-[1.3]" />
                    </Button>
                    <Button
                      onClick={() => setDelete(act.id)}
                      variant="outline"
                      size="sm"
                      className="shadow-md"
                    >
                      <RiDeleteBin6Fill className="scale-[1.3] text-red-500" />
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
