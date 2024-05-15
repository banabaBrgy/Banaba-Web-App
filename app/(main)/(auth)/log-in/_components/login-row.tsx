"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { FormEvent, useTransition } from "react";
import { ChevronRight, Loader2 } from "lucide-react";
import { actionLogIn } from "@/action/auth";
import { toast } from "sonner";

export function LoginRow() {
  const [isPending, setTransition] = useTransition();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setTransition(async () => {
      await actionLogIn(formData).then((data) => {
        if (data?.error) {
          return toast.error(data.error);
        }

        toast.success("Log In Successfully!");
      });
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

      <form onSubmit={handleSubmit} className="mt-11">
        <div className="flex flex-col gap-2 text-sm mb-6">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            name="email"
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
            required
            className="py-2 px-3 border border-gray-300 rounded-lg outline-none focus:shadow-lg  focus:border-gray-400 duration-200"
          />
        </div>

        <div>
          <Button
            disabled={isPending}
            className="space-x-2 w-full bg-blue-600 hover:bg-blue-600 active:bg-blue-600/60 disabled:cursor-not-allowed"
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
          <span className="text-gray-500">Don't have an account?</span>{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>

        <Link href="/forgot-password">
          <p className="text-gray-500">Forgot password?</p>
        </Link>
      </div>
    </div>
  );
}
