"use client";

import { Button } from "@/components/ui/button";
import { ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import React from "react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/utils/z-schema";
import { actionRegister } from "@/action/auth";
import { toast } from "sonner";

export function RegisterRow() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: z.infer<typeof registerSchema>) {
    await actionRegister(data).then((data) => {
      if (data?.error) {
        return toast.error(data.error);
      }

      toast.success("Registered Successfully!");
    });
  }

  const chunkErrors = Object.values(errors);

  return (
    <div className="max-w-[27rem] bg-white p-10 rounded-xl shadow-2xl flex-1 mx-3">
      <div className="space-y-1">
        <h1 className="text-lg font-semibold text-center">
          Create your account.
        </h1>
        <p className="text-[13px] text-gray-500 text-center">
          Welcome! Please fill in the details to get started.
        </p>
      </div>

      {!!chunkErrors.length && (
        <p className="mt-5 text-sm p-2 bg-pink-500/10 rounded text-pink-600 text-center">
          {chunkErrors[0].message}
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-11">
        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="firstName">First name</label>
            <input
              type="text"
              id="firstName"
              {...register("firstName")}
              className="py-2 px-3 border border-gray-300 rounded-lg outline-none focus:shadow-lg focus:border-gray-400"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="lastName">Last name</label>
            <input
              type="text"
              id="lastName"
              {...register("lastName")}
              className="py-2 px-3 border border-gray-300 rounded-lg outline-none focus:shadow-lg  focus:border-gray-400 duration-200"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 text-sm mb-6">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            {...register("email")}
            className="py-2 px-3 border border-gray-300 rounded-lg outline-none focus:shadow-lg  focus:border-gray-400 duration-200"
          />
        </div>

        <div className="flex flex-col gap-2 text-sm mb-10">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            {...register("password")}
            className="py-2 px-3 border border-gray-300 rounded-lg outline-none focus:shadow-lg  focus:border-gray-400 duration-200"
          />
        </div>

        <div>
          <Button
            disabled={isSubmitting}
            className="space-x-2 w-full bg-green-600 hover:bg-green-600 active:bg-green-600/60 disabled:cursor-not-allowed active:scale-[.98]"
          >
            {isSubmitting ? (
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
          <span className="text-gray-500">Already have an account?</span>{" "}
          <Link href="/log-in" className="text-green-600 hover:underline">
            Log in
          </Link>
        </p>

        <Link href="/forgot-password">
          <p className="text-gray-500">Forgot password?</p>
        </Link>
      </div>
    </div>
  );
}
