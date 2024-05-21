"use client";

import React, { useState, useTransition } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { verifyEmail } from "@/action/auth";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function VerificationForm({ token }: { token: string }) {
  const router = useRouter();
  const [pending, setTransition] = useTransition();
  const [verificationCode, setVerificationCode] = useState("");

  function action() {
    setTransition(async () => {
      await verifyEmail(token, verificationCode).then((data) => {
        if (data?.error) {
          return toast.error(data.error);
        }

        toast.success("Email verified");
        router.push(data.data === "Admin" ? "/admin" : "/resident");
      });
    });
  }

  return (
    <form action={action} className="flex flex-col items-center gap-y-5">
      <InputOTP
        onChange={(n) => setVerificationCode(n)}
        autoFocus
        maxLength={6}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>

      <Button
        disabled={pending}
        className="w-full bg-green-600 hover:bg-green-600/50 disabled:bg-green-600/50"
      >
        {pending ? <Loader2 className="animate-spin" /> : "Submit"}
      </Button>
    </form>
  );
}
