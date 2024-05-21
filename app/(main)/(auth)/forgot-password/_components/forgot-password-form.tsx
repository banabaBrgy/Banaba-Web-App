"use client";

import React, { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendEmailForgotPassword } from "@/action/auth";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function ForgotPasswordForm() {
  const [pending, setTransition] = useTransition();

  function action(formData: FormData) {
    const email = formData.get("email") as string;

    setTransition(async () => {
      await sendEmailForgotPassword(email).then(() =>
        toast.success("We send the link to your email")
      );
    });
  }

  return (
    <form action={action}>
      <label htmlFor="email" className="text-sm">
        Email
      </label>
      <Input
        type="email"
        name="email"
        id="email"
        placeholder="example@gmail.com"
        className="mt-2"
      />

      <Button
        disabled={pending}
        className="w-full bg-green-600 hover:bg-green-600/60 disabled:bg-green-600/60 mt-5"
      >
        {pending ? <Loader2 className="animate-spin" /> : "Continue"}
      </Button>
    </form>
  );
}
