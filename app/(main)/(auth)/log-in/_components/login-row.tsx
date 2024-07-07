"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useTransition } from "react";
import { ChevronRight, Loader2 } from "lucide-react";
import { actionLogIn } from "@/action/auth";
import { toast } from "sonner";

export function LoginRow() {
  const [isPending, setTransition] = useTransition();

  function action(formData: FormData) {
    setTransition(async () => {
      await actionLogIn(formData)
        .then((data) => {
          if (data?.error) {
            return toast.error(data.error);
          }

          toast.success("Log in successfully");
        })
        .catch(() => toast.error("Something went wrong"));
    });
  }

  return (
    <div className="max-w-[27rem] bg-white p-10 rounded-xl shadow-2xl flex-1 mx-3">
      <div className="space-y-1">
        <h1 className="text-lg font-semibold text-center">Log in</h1>
        <p className="text-[13px] text-gray-500 text-center">
          Welcome back! Please Log in to continue.
        </p>
      </div>

      <form action={action} className="mt-11">
        <div className="flex flex-col gap-2 text-sm mb-6">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="example@email.com"
            required
            className="py-2 px-3 border border-gray-300 rounded-lg outline-none focus:shadow-lg  focus:border-gray-400 duration-200"
          />
        </div>

        <div className="flex flex-col gap-2 text-sm mb-10">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            required
            className="py-2 px-3 border border-gray-300 rounded-lg outline-none focus:shadow-lg  focus:border-gray-400 duration-200"
          />
        </div>

        <div>
          <Button
            disabled={isPending}
            className="space-x-2 w-full bg-gradient-to-br from-green-600 via-green-500 to-green-400  active:from-green-300 active:via-green-300 active:to-green-300 active:scale-[.98]"
          >
            {isPending ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <>
                <span>Continue</span> <ChevronRight size={15} />
              </>
            )}
          </Button>
        </div>
      </form>

      <div className="flex flex-col items-center gap-2 mt-10 text-sm">
        <p>
          Don&apos;t have an account? <Link href="/register">Register</Link>{" "}
        </p>

        <Link href="/forgot-password">Forgot password?</Link>
      </div>
    </div>
  );
}
