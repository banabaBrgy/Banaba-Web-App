import { getPinnedInquiries } from "@/lib/faq";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default async function FaqPage() {
  const faq = await getPinnedInquiries();

  return (
    <div className="min-h-screen pb-32">
      <div className="flex flex-col justify-center items-center gap-1 bg-green-700 pt-24 pb-7 mb-8 text-white">
        <h1 className="title_outline text-2xl font-extrabold uppercase">
          Frequently ask questions
        </h1>
        <p className="title_outline uppercase text-xl font-extrabold">(Faq)</p>
      </div>

      <div className="max-w-[65rem] mx-auto px-5">
        <Accordion type="multiple" className="w-full">
          {faq.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id}>
              <AccordionTrigger>{faq.message}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
