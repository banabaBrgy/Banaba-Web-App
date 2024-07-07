import {
  markAsRead,
  markAsUnread,
  removeNotification,
} from "@/action/notification";
import { revalidateRealtime } from "@/action/revalidate-realtime";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { pusherClient } from "@/lib/pusher";
import { UserType } from "@/lib/user";
import { cn } from "@/lib/utils";
import { useUnreadNotificationLength } from "@/utils/zustand";
import { MarkAllAsRead, Notification } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { CgRemoveR } from "react-icons/cg";
import { IoMdCheckmark } from "react-icons/io";
import { toast } from "sonner";
import { format } from "timeago.js";

type UserNotificationProp = {
  user: UserType | null;
  setOpenNotif: React.Dispatch<React.SetStateAction<boolean>>;
};

type UserNotificationType = (Notification & {
  markAllAsRead: MarkAllAsRead[];
})[];

export default function UserNotification({
  user,
  setOpenNotif,
}: UserNotificationProp) {
  const [openPopover, setOpenPopover] = useState("");
  const queryClient = useQueryClient();
  const [isAll, setIsAll] = useState(true);
  const setUserUnreadNotification = useUnreadNotificationLength(
    (s) => s.setUserUnreadNotifications
  );

  const { data: userNotifications, isLoading } = useQuery({
    queryKey: ["user-notifications"],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/user/notifications`);
        return res.data as UserNotificationType;
      } catch (error: any) {
        console.log(error.message);
      }
    },
  });

  useEffect(() => {
    if (!user?.id) return;

    pusherClient.subscribe(user.id);

    pusherClient.bind("user:notification", (data: Notification) => {
      queryClient.setQueryData(
        ["user-notifications"],
        (prev: Notification[]) => [data, ...prev]
      );
      revalidateRealtime();
    });

    return () => {
      pusherClient.unsubscribe(user.id);
      pusherClient.unbind("user:notification");
    };
  }, [user?.id, queryClient]);

  const mutationMarkAsRead = useMutation({
    mutationFn: async (notifId: string) => {
      const data = await markAsRead(notifId);
      return data;
    },
    onSuccess: (data, variable) => {
      queryClient.setQueryData(
        ["user-notifications"],
        (prev: UserNotificationType) =>
          prev.map((notif) =>
            notif.id === variable
              ? { ...notif, markAllAsRead: [...notif.markAllAsRead, data] }
              : notif
          )
      );
    },
    onError: () => toast.error("Something went wrong"),
  });

  const mutationMarkAsUnRead = useMutation({
    mutationFn: async (notifId: string) => {
      const data = await markAsUnread(notifId);
      return data;
    },
    onMutate: (variable: string) => {
      queryClient.setQueryData(
        ["user-notifications"],
        (prev: UserNotificationType) =>
          prev.map((notif) =>
            notif.id === variable
              ? {
                  ...notif,
                  markAllAsRead: notif.markAllAsRead.filter(
                    (mark) =>
                      mark.notificationId !== variable &&
                      mark.userId !== user?.id
                  ),
                }
              : notif
          )
      );
    },
    onError: () => toast.error("Something went wrong"),
  });

  const mutationRemoveNotification = useMutation({
    mutationFn: async (notifId: string) => {
      const data = await removeNotification(notifId);
      return data;
    },
    onMutate: (variable: string) => {
      queryClient.setQueryData(
        ["user-notifications"],
        (prev: UserNotificationType) =>
          prev.filter((notif) => notif.id !== variable)
      );
    },
    onError: () => toast.error("Something went wrong"),
  });

  const allUnmarkAsReadNotif = userNotifications?.filter(
    (notif) => !notif.markAllAsRead.some((mark) => mark.userId === user?.id)
  );

  useEffect(() => {
    setUserUnreadNotification(allUnmarkAsReadNotif?.length || 0);
  }, [allUnmarkAsReadNotif?.length, setUserUnreadNotification]);

  const mutationMarkAllAsRead = useMutation({
    mutationFn: async () => {
      if (allUnmarkAsReadNotif?.length) {
        for (let i = 0; i < allUnmarkAsReadNotif.length; i++) {
          const notifId = allUnmarkAsReadNotif[i].id;
          await markAsRead(notifId);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-notifications"] });
    },
    onError: () => toast.error("Something went wrong"),
  });

  const mutationRemoveAllNotification = useMutation({
    mutationFn: async () => {
      if (userNotifications?.length) {
        for (let i = 0; i < userNotifications.length; i++) {
          const notifId = userNotifications[i].id;
          await removeNotification(notifId);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-notifications"] });
    },
    onError: () => toast.error("Something went wrong"),
  });

  return (
    <>
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-medium">Notifications</h1>

          <Popover
            open={openPopover === "header"}
            onOpenChange={(e) =>
              e ? setOpenPopover("header") : setOpenPopover("")
            }
          >
            <PopoverTrigger asChild>
              <button className="p-2 rounded-full hover:bg-zinc-100">
                <BsThreeDots className="scale-[1.2]" />
              </button>
            </PopoverTrigger>

            <PopoverContent
              onClick={() => setOpenPopover("")}
              align="end"
              className="z-[1001] p-2 text-sm"
            >
              <button
                onClick={() => mutationMarkAllAsRead.mutate()}
                className="flex items-center gap-2 hover:bg-zinc-100 w-full text-start p-2 rounded-md"
              >
                <IoMdCheckmark /> Mark all as read
              </button>
              <button
                onClick={() => mutationRemoveAllNotification.mutate()}
                className="flex items-center gap-2 hover:bg-zinc-100 w-full text-start p-2 rounded-md"
              >
                <CgRemoveR /> Remove all notification
              </button>
            </PopoverContent>
          </Popover>
        </div>

        <div className="text-sm space-x-2">
          <button
            onClick={() => setIsAll(true)}
            className={cn(
              "py-2 px-3 hover:bg-zinc-200 text-green-600 rounded-full",
              isAll && "bg-green-500/10"
            )}
          >
            All
          </button>
          <button
            onClick={() => setIsAll(false)}
            className={cn(
              "py-2 px-3 hover:bg-zinc-200 text-green-600 rounded-full",
              !isAll && "bg-green-500/10"
            )}
          >
            Unread
          </button>
        </div>
      </div>

      <div className="overflow-auto">
        {userNotifications?.filter((userNotif) =>
          !isAll
            ? !userNotif.markAllAsRead.some((mark) => mark.userId === user?.id)
            : userNotif
        )?.length === 0 && (
          <div className="p-4 flex items-center justify-center pb-12 pt-5 text-zinc-500">
            {!allUnmarkAsReadNotif?.length ? "No unread" : "No notifications"}
          </div>
        )}

        {isLoading && (
          <div className="p-4 flex items-center justify-center pb-12 pt-5 text-zinc-500">
            Loading...
          </div>
        )}

        {userNotifications
          ?.filter((userNotif) =>
            !isAll
              ? !userNotif.markAllAsRead.some(
                  (mark) => mark.userId === user?.id
                )
              : userNotif
          )
          ?.map((userNotif) => (
            <div
              key={userNotif.id}
              className="relative flex items-center group/show"
            >
              <Link
                onClick={() => {
                  mutationMarkAsRead.mutate(userNotif.id);
                  setOpenNotif(false);
                }}
                href={userNotif.path}
                className="flex-1"
              >
                <div className="flex gap-3 p-4 hover:bg-zinc-100">
                  <Image
                    src={"/logo.png"}
                    alt="profile"
                    width={500}
                    height={500}
                    priority
                    className="w-14 h-14 object-cover rounded-full"
                  />

                  <div className="space-y-1 text-[14.5px] flex-1 pr-5">
                    <p
                      dangerouslySetInnerHTML={{ __html: userNotif.message }}
                      className={cn(
                        "text-zinc-500 pr-5",
                        !userNotif.markAllAsRead.some(
                          (n) => n.userId === user?.id
                        ) && "text-black"
                      )}
                    />
                    <p className="text-sm text-zinc-500">
                      {format(userNotif.createdAt)}
                    </p>
                  </div>
                </div>
              </Link>

              <Popover
                open={openPopover === userNotif.id}
                onOpenChange={(e) =>
                  e ? setOpenPopover(userNotif.id) : setOpenPopover("")
                }
              >
                <PopoverTrigger asChild>
                  <button
                    className={cn(
                      "absolute right-4 border border-zinc-300 shadow rounded-full p-3 hover:bg-zinc-100 bg-white",
                      openPopover === userNotif.id
                        ? "visible"
                        : "sm:invisible group-hover/show:visible",
                      !userNotif.markAllAsRead.some(
                        (n) => n.userId === user?.id
                      ) && "right-9"
                    )}
                  >
                    <BsThreeDots className="scale-[1.3]" />
                  </button>
                </PopoverTrigger>

                <PopoverContent
                  onClick={() => setOpenPopover("")}
                  align="end"
                  className="border border-zinc-300 z-[1002] p-2 w-64 text-sm"
                >
                  <button
                    onClick={() => {
                      !userNotif.markAllAsRead.some(
                        (n) => n.userId === user?.id
                      )
                        ? mutationMarkAsRead.mutate(userNotif.id)
                        : mutationMarkAsUnRead.mutate(userNotif.id);
                    }}
                    className="flex items-center gap-2 hover:bg-zinc-100 w-full text-start p-2 rounded-md"
                  >
                    <IoMdCheckmark />{" "}
                    {!userNotif.markAllAsRead.some((n) => n.userId === user?.id)
                      ? "Mark as read"
                      : "Mark as unread"}
                  </button>

                  <button
                    onClick={() =>
                      mutationRemoveNotification.mutate(userNotif.id)
                    }
                    className="flex items-center gap-2 hover:bg-zinc-100 w-full text-start p-2 rounded-md"
                  >
                    <CgRemoveR /> Remove this notification
                  </button>
                </PopoverContent>
              </Popover>

              {!userNotif.markAllAsRead.some((n) => n.userId === user?.id) && (
                <span className="absolute right-4 h-3 w-3 rounded-full bg-green-500" />
              )}
            </div>
          ))}
      </div>
    </>
  );
}
