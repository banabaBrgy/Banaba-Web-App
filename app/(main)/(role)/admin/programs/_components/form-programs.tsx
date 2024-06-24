"use client";

import { createPrograms } from "@/action/admin/create-programs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEdgeStore } from "@/lib/edgestore";
import { Loader2 } from "lucide-react";
import React, { ElementRef, useRef, useTransition } from "react";
import { toast } from "sonner";

export default function FormPrograms() {
  const programsFormRef = useRef<ElementRef<"form">>(null);
  const { edgestore } = useEdgeStore();
  const [pending, setTransition] = useTransition();

  function onCreatePrograms(formData: FormData) {
    const about = formData.get("about") as string;
    const photo = formData.get("photo");

    setTransition(async () => {
      const res = await edgestore.publicFiles.upload({
        file: photo as File,
      });

      await createPrograms(about, res.url)
        .then(() => {
          toast.success("Created successfully");
          programsFormRef.current?.reset();
        })
        .catch((error) => toast.error(error.message));
    });
  }

  return (
    <form
      action={onCreatePrograms}
      ref={programsFormRef}
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
        variant="outline"
        className="w-full"
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
