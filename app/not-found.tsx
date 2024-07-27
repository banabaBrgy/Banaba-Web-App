"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next-nprogress-bar";
import React from "react";

const NotFound = () => {
  const router = useRouter();

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center">
      <h1 className="font-black sm:text-8xl text-6xl mb-6 text-green-500">
        Oops!
      </h1>
      <p className="font-medium mb-2">404 Page Not Found</p>
      <p className="mb-7 text-sm text-zinc-500 text-center mx-3">
        Sorry, the page you are looking for could not be found.
      </p>

      <Button
        onClick={() => router.back()}
        className="sm:text-base text-sm bg-green-500 hover:bg-green-500/80"
      >
        Back to previous page
      </Button>
    </div>
  );
};

export default NotFound;
