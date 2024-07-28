"use client";

import React, { ElementRef, useEffect, useRef, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createInquiries } from "@/action/user/inquiries";
import { toast } from "sonner";
import { CircleAlert, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { UserType } from "@/lib/user";

interface InquiriesFormProp {
  user: UserType | null;
}

export default function InquiriesForm({ user }: InquiriesFormProp) {
  const inquiriesFormRef = useRef<ElementRef<"form">>(null);
  const [pending, setTransition] = useTransition();

  const onCreateInquiries = (formData: FormData) => {
    setTransition(async () => {
      await createInquiries(formData)
        .then((data) => {
          if (data?.error) return toast.error(data.error);
          toast.success("Submitted successfully");
          inquiriesFormRef.current?.reset();
        })
        .catch(() => toast.error("Something went wrong"));
    });
  };

  const missingProfileInfo =
    !user?.birthDate ||
    !user?.age ||
    !user?.gender ||
    !user?.civilStatus ||
    !user?.placeOfBirth ||
    !user?.sitioPurok ||
    !user?.mobile;

  return (
    <form
      action={onCreateInquiries}
      ref={inquiriesFormRef}
      className="space-y-4 mt-4"
    >
      {missingProfileInfo && (
        <Alert
          className="mb-5 px-4 py-2 bg-destructive/10"
          variant="destructive"
        >
          <AlertDescription className="flex items-center gap-3">
            <CircleAlert className="h-4 w-4 shrink-0" />
            <p>
              Complete your{" "}
              <Link href="/user/profile" className="underline">
                profile
              </Link>{" "}
              to create inquiries.
            </p>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <label htmlFor="subject" className="text-sm">
          Subject
        </label>
        <Input
          type="text"
          id="subject"
          name="subject"
          required
          placeholder="Enter Subject"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm">
          Message
        </label>
        <Textarea
          rows={5}
          id="message"
          name="message"
          required
          placeholder="Enter your message here."
        />
      </div>

      <Button
        disabled={pending || missingProfileInfo}
        className="w-full bg-green-500 hover:bg-green-500/80 text-xs uppercase"
      >
        {pending ? <Loader2 className="animate-spin" /> : "Submit"}
      </Button>
    </form>
  );
}
