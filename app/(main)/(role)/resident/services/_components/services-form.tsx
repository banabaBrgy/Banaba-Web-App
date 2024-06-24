"use client";

import React, { ElementRef, useRef, useTransition } from "react";
import { requestDocument } from "@/action/resident/services";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ServicesForm() {
  const [pending, setTransition] = useTransition();
  const formRef = useRef<ElementRef<"form">>(null);

  function handleMyRequest(formData: FormData) {
    setTransition(async () => {
      await requestDocument(formData)
        .then(() => {
          toast.success("Requested successfully");
          formRef.current?.reset();
        })
        .catch((error) => toast.error(error.message));
    });
  }

  return (
    <form ref={formRef} action={handleMyRequest} className="mt-4 space-y-4">
      <div className="space-y-2">
        <label htmlFor="document" className="text-sm">
          Document
        </label>
        <select
          id="document"
          name="document"
          required
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Choose Document</option>
          <option value="Barangay Clearance">Barangay Clearance</option>
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="Purposes" className="text-sm">
          Purposes
        </label>
        <Textarea
          rows={10}
          required
          placeholder="Enter purposes"
          name="purposes"
        />
      </div>

      <Button disabled={pending} className="w-full uppercase">
        {pending ? <Loader2 className="animate-spin" /> : "Submit"}
      </Button>
    </form>
  );
}
