"use client";

import { markAnnouncementAsRead } from "@/action/user/announcement";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Announcement } from "@prisma/client";
import Image from "next/image";
import React, { ElementRef, useEffect, useRef, useState } from "react";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

interface AnnouncementRowProp {
  announcements: Announcement[] | undefined;
}

export default function AnnouncementRow({
  announcements,
}: AnnouncementRowProp) {
  const [viewImage, setViewImage] = useState<Announcement | null>(null);
  const viewImageRef = useRef<ElementRef<"div">>(null);

  const tableHead = ["About", "Photo", "Uploaded"];

  const dateFormatter = Intl.DateTimeFormat("en-us", {
    dateStyle: "medium",
  });

  useEffect(() => {
    markAnnouncementAsRead();
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!viewImageRef.current?.contains(e.target as any)) {
        setViewImage(null);
      }
    }

    window.addEventListener("click", handleClick);

    return () => window.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    if (viewImage?.id) {
      document.body.style.overflow = "clip";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [viewImage?.id]);

  const viewingImageIndex = announcements?.findIndex(
    (ann) => ann.id === viewImage?.id
  );

  const viewPrevImage =
    announcements && viewingImageIndex != undefined
      ? announcements[viewingImageIndex - 1]
      : null;

  const viewNextImage =
    announcements && viewingImageIndex != undefined
      ? announcements[viewingImageIndex + 1]
      : null;

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 flex pt-10 pb-20 bg-black/70 z-[1001] duration-200 overflow-auto",
          viewImage?.id ? "opacity-100 visible" : "opacity-0 invisible"
        )}
      >
        <div
          ref={viewImageRef}
          className={cn(
            "mx-auto my-auto duration-200",
            viewImage?.id ? "visible scale-100" : "invisible scale-95"
          )}
        >
          {viewImage?.photo && viewImage?.about && (
            <Image
              src={viewImage?.photo}
              alt={viewImage?.about}
              width={500}
              height={590}
              priority
              className="w-full md:w-auto h-auto max-w-[35rem] mx-auto"
            />
          )}
        </div>

        <div className="fixed left-4 inset-y-0 md:flex hidden items-center">
          <Button
            title="Previous"
            disabled={!viewPrevImage?.id}
            onClick={(e) => {
              setViewImage(viewPrevImage);
              e.stopPropagation();
            }}
            size="icon"
            variant="secondary"
            className="rounded-full p-2 bg-secondary/60  backdrop-blur-sm"
          >
            <IoChevronBackOutline className="scale-[1.5]" />
          </Button>
        </div>

        <div className="fixed right-4 inset-y-0 md:flex hidden items-center">
          <Button
            title="Next"
            disabled={!viewNextImage?.id}
            onClick={(e) => {
              setViewImage(viewNextImage);
              e.stopPropagation();
            }}
            size="icon"
            variant="secondary"
            className="rounded-full p-2 bg-secondary/60  backdrop-blur-sm"
          >
            <IoChevronForwardOutline className="scale-[1.5]" />
          </Button>
        </div>

        <div className="fixed bottom-0 inset-x-0 flex md:hidden items-center gap-1">
          <Button
            disabled={!viewPrevImage?.id}
            onClick={(e) => {
              setViewImage(viewPrevImage);
              e.stopPropagation();
            }}
            size="icon"
            variant="secondary"
            className="p-2 bg-secondary/60 rounded-none w-full backdrop-blur-sm"
          >
            Previous
          </Button>

          <Button
            disabled={!viewNextImage?.id}
            onClick={(e) => {
              setViewImage(viewNextImage);
              e.stopPropagation();
            }}
            size="icon"
            variant="secondary"
            className="p-2 bg-secondary/60 rounded-none w-full backdrop-blur-sm"
          >
            Next
          </Button>
        </div>
      </div>

      <div className="overflow-auto mt-4">
        <table className="border-collapse w-full bg-white">
          <thead>
            <tr>
              {tableHead.map((th) => (
                <th
                  key={th}
                  className="border border-green-500 bg-green-500 text-white font-medium p-2 uppercase text-sm"
                >
                  {th}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {announcements?.map((announcement) => (
              <tr
                key={announcement.id}
                className="md:text-sm text-xs text-center"
              >
                <td className="p-2 border border-[#dddddd] max-w-[15rem]">
                  {announcement.about}
                </td>
                <td className="p-2 border border-[#dddddd]">
                  <Image
                    onClick={(e) => {
                      setViewImage(announcement);
                      e.stopPropagation();
                    }}
                    src={announcement.photo}
                    alt={announcement.about}
                    width={500}
                    height={590}
                    priority
                    className="w-full h-auto max-w-[35rem] mx-auto"
                  />
                </td>
                <td className="p-2 border border-[#dddddd]">
                  {dateFormatter.format(announcement.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
