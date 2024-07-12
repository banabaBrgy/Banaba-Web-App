import React from "react";
import { PiUsersThreeFill } from "react-icons/pi";
import { GiQuillInk, GiTimeTrap } from "react-icons/gi";
import { BiSolidUserCheck } from "react-icons/bi";
import { cn } from "@/lib/utils";
import { CountUpAnimation } from "@/components/count-up-animation";
import { getCalendarActivities } from "@/lib/query/user/dashboard";
import { ReactBigCalendar } from "./_components/react-bitg-calendar";

export default async function ResidentPage() {
  const calendarActivities = await getCalendarActivities();

  const dashBoard = [
    {
      total: 59,
      name: "Active(s)",
      icon: <BiSolidUserCheck size={55} />,
      bg: "bg-gradient-to-tr from-blue-600 via-blue-400 to-blue-300",
    },
    {
      total: 300,
      name: "Total Blotter(s)",
      icon: <GiQuillInk size={50} />,
      bg: "bg-gradient-to-tr from-lime-600 via-lime-400 to-lime-300",
    },
    {
      total: 1334,
      name: "Total Resident(s)",
      icon: <PiUsersThreeFill size={50} />,
      bg: "bg-gradient-to-tr from-pink-600 via-pink-400 to-pink-300",
    },
    {
      total: 100,
      name: "Pending Request",
      icon: <GiTimeTrap size={50} />,
      bg: "bg-gradient-to-tr from-violet-600 via-violet-400 to-violet-300",
    },
  ];

  return (
    <div className="md:px-4 px-3 py-4">
      <h1 className="font-semibold text-lg uppercase">Dashboard</h1>

      <div className="grid md:grid-cols-4 min-[500px]:grid-cols-2 grid-cols-1 gap-3 mt-4 text-white">
        {dashBoard.map((item, idx) => (
          <div
            key={idx}
            className={cn(
              "flex items-center justify-center py-6 px-2 rounded-md",
              item.bg
            )}
          >
            <div className="flex-1 flex flex-col gap-2 justify-center items-center">
              <CountUpAnimation total={item.total} />
              <p className="text-xs text-center">{item.name}</p>
            </div>
            <div className="flex-1 flex justify-center items-center">
              {item.icon}
            </div>
          </div>
        ))}
      </div>

      <ReactBigCalendar calendarActivities={calendarActivities} />
    </div>
  );
}
