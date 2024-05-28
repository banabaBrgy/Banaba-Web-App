import dynamic from "next/dynamic";
import React from "react";
const BlotterForm = dynamic(() => import("./_components/blotter-form"), {
  ssr: false,
});

export default function BlotterPage() {
  return (
    <div className="md:px-4 px-3 py-4">
      <h1 className="text-lg uppercase">Blotter Information Form</h1>

      <BlotterForm />
    </div>
  );
}
