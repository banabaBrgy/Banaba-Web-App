"use client";

import React, { ElementRef, useRef, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createInquiries } from "@/action/resident/inquiries";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function InquiriesForm() {
  const inquiriesFormRef = useRef<ElementRef<"form">>(null);
  const [pending, setTransition] = useTransition();

  const onCreateInquiries = (formData: FormData) => {
    setTransition(async () => {
      await createInquiries(formData)
        .then(() => {
          toast.success("Submitted successfully");
          inquiriesFormRef.current?.reset();
        })
        .catch((error) => toast.error(error.message));
    });
  };

  return (
    <form
      action={onCreateInquiries}
      ref={inquiriesFormRef}
      className="space-y-4 mt-4"
    >
      <div className="space-y-2">
        <label htmlFor="subject" className="text-sm">
          Subject
        </label>
        <Input
          type="text"
          id="subject"
          name="subject"
          placeholder="Enter Subject"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm">
          Message
        </label>
        <Textarea
          rows={10}
          id="message"
          name="message"
          placeholder="Enter your message here."
        />
      </div>

      <Button disabled={pending} className="w-full uppercase">
        {pending ? <Loader2 className="animate-spin" /> : "Submit"}
      </Button>
    </form>
  );
}
