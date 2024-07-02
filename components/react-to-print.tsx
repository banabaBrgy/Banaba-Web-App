import React, { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "./ui/button";
import { IoMdPrint } from "react-icons/io";
import { usePathname } from "next/navigation";

interface ReactToPrintProp {
  pending?: boolean;
  value: {
    incident: string;
    placeOfIncident: string;
    dateTime: string;
    witnesses: string[];
    narrative: string;
  };
}

export default function ReactToPrint({ pending, value }: ReactToPrintProp) {
  const { incident, placeOfIncident, dateTime, witnesses, narrative } = value;
  const contentToPrint = useRef(null);
  const [isLoading, setisLoading] = useState(false);
  const pathname = usePathname();

  const handlePrint = useReactToPrint({
    documentTitle: "Barangay blotter",
    onBeforePrint: () => setisLoading(true),
    onAfterPrint: () => setisLoading(false),
    removeAfterPrint: true,
  });

  const isNoValue =
    !value.dateTime ||
    !value.incident ||
    !value.narrative ||
    !value.placeOfIncident;

  return (
    <div className="w-full">
      <div className="fixed inset-0 bg-white z-[1001] hidden">
        <div ref={contentToPrint} className="p-5">
          <h1 className="w-[20rem] mx-auto text-center">
            Republic of the Philippines province of banaba east batangas city
          </h1>
        </div>
      </div>

      <Button
        onClick={() => handlePrint(null, () => contentToPrint.current)}
        disabled={pending || isLoading || isNoValue}
        variant="outline"
        type="button"
        className="w-full shadow-md"
        size="sm"
      >
        <IoMdPrint className="scale-[1.4]" />
      </Button>
    </div>
  );
}
