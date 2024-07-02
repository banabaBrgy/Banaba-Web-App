import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import React from "react";
import { BsThreeDots } from "react-icons/bs";
import { format } from "timeago.js";

export default function UserNotification() {
  return (
    <>
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-medium">Notifications</h1>

          <BsThreeDots />
        </div>

        <div className="text-sm">
          <button className="px-3 border-b-2 border-black">All</button>
          <button className="px-3">Unread</button>
        </div>
      </div>

      <div>
        {/*  {userNotifications?.map((userNotif) => (
          <Link href={userNotif.path} key={userNotif.id}>
            <div className="space-y-2 p-3 hover:bg-zinc-100">
              <p dangerouslySetInnerHTML={{ __html: userNotif.message }} />
              <p className="text-sm text-zinc-500">
                {format(userNotif.createdAt)}
              </p>
            </div>
          </Link>
        ))} */}
      </div>
    </>
  );
}
