import Link from "next/link";
import React from "react";
import { ForgotPasswordForm } from "./_components/forgot-password-form";
import ChangePasswordForm from "./_components/change-password-form";

export default function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: { token: string };
}) {
  const { token } = searchParams;

  return (
    <div className="p-10 bg-white shadow-2xl rounded-md max-w-[30rem] flex-1">
      {!token ? (
        <>
          <div className="space-y-8 mb-5">
            <h1 className="text-2xl font-bold text-center">Forgot password</h1>
            <p className="text-sm text-gray-600">
              Enter the email addresses associated with your account and
              we&apos;ll send you a link to reset your password
            </p>
          </div>
          <ForgotPasswordForm />
          <p className="text-center mt-10 text-sm">
            Don&apos;t have an account? <Link href="/register">Register</Link>
          </p>
        </>
      ) : (
        <ChangePasswordForm token={token} />
      )}
    </div>
  );
}
