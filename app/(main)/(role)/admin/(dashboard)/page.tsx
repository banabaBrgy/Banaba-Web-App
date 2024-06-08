import dynamic from "next/dynamic";
import React from "react";
import { CountUpAnimation } from "@/components/count-up-animation";
import { cn } from "@/lib/utils";
import { GiQuillInk, GiTimeTrap } from "react-icons/gi";
import { PiUsersThreeFill } from "react-icons/pi";
import { FaVoteYea } from "react-icons/fa";
import Calendar from "react-calendar";
const Graph = dynamic(() => import("./_components/graph"), { ssr: false });

export default function AdminPage() {
  const dashBoard = [
    {
      total: 59,
      name: "Register Voter(s)",
      icon: <FaVoteYea size={50} />,
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

  const [day, month, year] = new Date()
    .toLocaleDateString([], { dateStyle: "full" })
    .split(", ");

  return (
    <div className="md:px-4 px-3 py-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

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

      <Graph />

      <div
        style={{ boxShadow: "1px 1px 10px rgba(0, 0, 0, .2)" }}
        className="flex sm:flex-row flex-col gap-4 mt-4 p-4 bg-gradient-to-tr from-yellow-600 via-yellow-500 to-yellow-400 rounded-md"
      >
        <div className="flex flex-col items-center justify-center gap-2 p-10 sm:basis-[23rem] text-white animate-in">
          <p className="font-semibold uppercase text-3xl">{day}</p>
          <p className="text-7xl font-semibold text-red-500">
            {month.split(" ")[1]}
          </p>
          <p className="font-semibold text-2xl">{year}</p>
        </div>

        <Calendar
          defaultValue={new Date()}
          className="border-none p-4 rounded-md flex-1 w-full"
        />
      </div>
    </div>
  );
}
