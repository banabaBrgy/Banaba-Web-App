"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next-nprogress-bar";
import React from "react";

const NotFound = () => {
  const router = useRouter();

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center">
      <h1 className="font-black text-8xl mb-6">Oops!</h1>
      <p className="font-medium mb-4">404 - PAGE NOT FOUND</p>
      <p className="mb-7 text-sm text-zinc-500">
        Sorry, the page you are looking for could not be found.
      </p>

      <Button onClick={() => router.back()}>Back to previous page</Button>
    </div>
  );
};

export default NotFound;
