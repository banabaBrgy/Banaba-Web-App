"use client";

import { changePassword } from "@/action/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { changePasswordSchema } from "@/utils/z-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export default function ChangePasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
  });

  async function onSubmit(data: z.infer<typeof changePasswordSchema>) {
    await changePassword(data, token).then((data) => {
      if (data?.error) {
        return toast.error(data?.error);
      }

      toast.success(data.data);
      router.push("/log-in");
    });
  }

  const validationErrors = Object.values(errors);

  return (
    <div>
      <h1 className="text-2xl font-bold text-center mb-8">Change password</h1>

      {!!validationErrors.length && (
        <p className="p-2 bg-pink-100 text-sm border border-pink-300 text-pink-600 mb-5 text-center rounded-md">
          {validationErrors[0]?.message}
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2 mb-3">
          <label htmlFor="current-password" className="text-sm">
            Current password
          </label>
          <Input
            type="password"
            {...register("currentPassword")}
            id="current-password"
          />
        </div>

        <div className="space-y-2 mb-3">
          <label htmlFor="new-password" className="text-sm">
            New password
          </label>
          <Input
            type="password"
            {...register("newPassword")}
            id="new-password"
          />
        </div>

        <div className="space-y-2 mb-3">
          <label htmlFor="confirm-password" className="text-sm">
            Confirm password
          </label>
          <Input
            type="password"
            {...register("confirmPassword")}
            id="confirm-password"
          />
        </div>

        <Button
          disabled={isSubmitting}
          className="w-full mt-5 bg-green-600 hover:bg-green-600/60 disabled:bg-green-600/60"
        >
          {isSubmitting ? <Loader2 className="animate-spin" /> : "Continue"}
        </Button>
      </form>
    </div>
  );
}
