import React from "react";
import { VerificationForm } from "./_component/verification-form";

export default function VerifyPage({
  searchParams,
}: {
  searchParams: { token: string };
}) {
  const { token } = searchParams;

  return (
    <div className="bg-white p-10 shadow-2xl rounded-md max-w-[30rem]">
      <div className="space-y-1 mb-8">
        <h1 className="text-2xl font-bold text-center">Verification code</h1>
        <p className="text-sm text-gray-600">
          Please enter the 6-digit verification code we sent to your email to
          continue.
        </p>
      </div>

      <VerificationForm token={token} />
    </div>
  );
}
