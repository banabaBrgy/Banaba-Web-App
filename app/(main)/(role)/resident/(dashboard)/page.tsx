import React from "react";
import { PiUsersThreeFill } from "react-icons/pi";
import { GiQuillInk, GiTimeTrap } from "react-icons/gi";
import { BiSolidUserCheck } from "react-icons/bi";
import { cn } from "@/lib/utils";
import { CountUpAnimation } from "@/components/count-up-animation";
import ReactBigCalendar from "@/components/react-big-calendar";

export default async function ResidentPage() {
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
      <h1 className="font-semibold text-xl">Dashboard</h1>

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

      <div
        style={{ boxShadow: "1px 1px 10px rgba(0, 0, 0, .2)" }}
        className="space-y-4 mt-4 p-4 rounded-md bg-white"
      >
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3874.431479607053!2d121.0643701742192!3d13.81310989587289!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33bd0fcd69c6b5a5%3A0x336c8e16b2e275ee!2sBANABA%20EAST%2C%20BARANGAY%20HALL!5e0!3m2!1sen!2sph!4v1716447741892!5m2!1sen!2sph"
          width="600"
          height="450"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-[18rem]"
        />
      </div>

      <ReactBigCalendar />
    </div>
  );
}
