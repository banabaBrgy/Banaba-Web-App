"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import React, { FormEvent, useState } from "react";

export default function FaqPage() {
  const [question, setQuestion] = useState<string[]>([]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const question = formData.get("question") as string;

    setQuestion((prev) => [...prev, question]);

    e.currentTarget.reset();
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#D9D9D9] to-white pb-32">
      <div className="flex flex-col justify-center items-center gap-1 bg-green-700 pt-24 pb-7 mb-8 text-white">
        <h1 className="title_outline text-2xl font-extrabold uppercase tracking-widest">
          Frequently ask questions
        </h1>
        <p className="title_outline uppercase text-xl font-extrabold">(Faq)</p>
      </div>

      <div className="max-w-[65rem] mx-auto px-3">
        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea name="question" placeholder="Ask your question here..." />
          <Button className="w-full">Add your questions</Button>
        </form>

        <div className="grid md:grid-cols-2 gap-2 mt-4">
          {question.map((item, index) => (
            <div
              key={index}
              className="p-2 bg-gray-200 rounded-md shadow border border-gray-300"
            >
              {index + 1}. {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
