import React from "react";
import { PiUsersThreeFill } from "react-icons/pi";
import { GiQuillInk, GiTimeTrap } from "react-icons/gi";
import { BiSolidUserCheck } from "react-icons/bi";
import { cookies } from "next/headers";

export default function ResidentPage() {
  const dashBoard = [
    {
      total: 59,
      name: "Active(s)",
      icon: <BiSolidUserCheck size={70} color="#D32D41" />,
    },
    {
      total: 300,
      name: "Total Blotter(s)",
      icon: <GiQuillInk size={60} color="#4CB5F5" />,
    },
    {
      total: 1334,
      name: "Total Resident(s)",
      icon: <PiUsersThreeFill size={60} color="#488A99" />,
    },
    {
      total: 100,
      name: "Pending Request",
      icon: <GiTimeTrap size={60} color="#EA6A47" />,
    },
  ];

  return (
    <div className="p-3">
      <form
        action={async () => {
          "use server";

          cookies().set("token", "");
        }}
      >
        <button>Log out</button>
      </form>
    </div>
  );
}
