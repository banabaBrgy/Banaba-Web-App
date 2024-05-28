import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

export default function InquiriesPage() {
  return (
    <div className="px-4 py-4">
      <h1 className="text-lg uppercase">Inquiries</h1>

      <form action="" className="space-y-4 mt-4">
        <div className="space-y-2">
          <label htmlFor="subject" className="text-sm">
            Subject
          </label>
          <Input type="text" id="subject" placeholder="Enter Subject" />
        </div>

        <div className="space-y-2">
          <label htmlFor="message" className="text-sm">
            Message
          </label>
          <Textarea
            rows={10}
            id="message"
            placeholder="Enter your message here."
          />
        </div>

        <Button className="w-full bg-gradient-to-tr from-green-600 via-green-500 to-green-400 uppercase">
          Submit
        </Button>
      </form>
    </div>
  );
}
