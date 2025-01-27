"use client";

import { createAnnouncement } from "@/action/admin/announcement";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEdgeStore } from "@/lib/edgestore";
import { Loader2 } from "lucide-react";
import React, { ElementRef, useRef, useTransition } from "react";
import { toast } from "sonner";

export default function FormAnnouncement() {
  const announcementFormRef = useRef<ElementRef<"form">>(null);
  const [pending, setTransition] = useTransition();
  const { edgestore } = useEdgeStore();

  async function onCreateAnnouncement(formData: FormData) {
    const about = formData.get("about") as string;
    const photo = formData.get("photo") as File;

    const acceptedMimeType = [
      "image/webp",
      "image/jpg",
      "image/jpeg",
      "image/png",
    ];

    if (photo.name && !acceptedMimeType.includes(photo.type)) {
      return toast.error("Invalid image type");
    }

    setTransition(async () => {
      const res = await edgestore.publicFiles.upload({
        file: photo,
      });

      await createAnnouncement(about, res.url)
        .then(() => {
          toast.success("Created successfully");
          announcementFormRef.current?.reset();
        })
        .catch(() => toast.error("Something went wrong"));
    });
  }

  return (
    <form
      action={onCreateAnnouncement}
      ref={announcementFormRef}
      className="space-y-2 mt-3"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-3">
        <div className="space-y-2">
          <label htmlFor="about" className="text-sm">
            About
          </label>
          <Input
            type="text"
            name="about"
            id="about"
            required
            placeholder="Enter about"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="photo" className="text-sm">
            Photo
          </label>
          <Input
            accept="image/jpg, image/webp, image/jpeg, image/png"
            type="file"
            name="photo"
            required
            id="photo"
          />
        </div>
      </div>

      <Button
        disabled={pending}
        type="submit"
        className="w-full uppercase text-xs bg-green-500 hover:bg-green-500/80"
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
