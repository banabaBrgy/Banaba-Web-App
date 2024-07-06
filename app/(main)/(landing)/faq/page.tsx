"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

export default function FaqPage() {
  return (
    <div className="min-h-screen pb-32">
      <div className="flex flex-col justify-center items-center gap-1 bg-green-700 pt-24 pb-7 mb-8 text-white">
        <h1 className="title_outline text-2xl font-extrabold uppercase">
          Frequently ask questions
        </h1>
        <p className="title_outline uppercase text-xl font-extrabold">(Faq)</p>
      </div>

      <div className="max-w-[65rem] mx-auto px-3"></div>
    </div>
  );
}
