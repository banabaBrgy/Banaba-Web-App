import React, { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "./ui/button";

interface ReactToPrintProp {
  pending?: boolean;
  value: {
    barangayPurokSitio: string;
    incident: string;
    placeOfIncident: string;
    dateTime: string;
    witnesses: string[];
    narrative: string;
  };
}

export default function ReactToPrint({ pending, value }: ReactToPrintProp) {
  const {
    barangayPurokSitio,
    incident,
    placeOfIncident,
    dateTime,
    witnesses,
    narrative,
  } = value;
  const contentToPrint = useRef(null);
  const [isLoading, setisLoading] = useState(false);

  const handlePrint = useReactToPrint({
    documentTitle: "Barangay blotter",
    onBeforePrint: () => setisLoading(true),
    onAfterPrint: () => setisLoading(false),
    removeAfterPrint: true,
  });

  const isNoValue =
    !value.barangayPurokSitio ||
    !value.dateTime ||
    !value.incident ||
    !value.narrative ||
    !value.placeOfIncident;

  return (
    <div className="w-full">
      <div className="fixed inset-0 bg-white z-[1001] hidden">
        <div ref={contentToPrint} className="px-5 py-10">
          <h2 className="text-center font-medium text-xl">
            OFFICE OF THE BARANGAY CHAIRMAN
          </h2>

          <h1 className="text-center text-2xl font-semibold mt-5">
            BLOTTER REPORT
          </h1>
        </div>
      </div>

      <Button
        onClick={() => handlePrint(null, () => contentToPrint.current)}
        disabled={pending || isLoading || isNoValue}
        variant="secondary"
        type="button"
        className="w-full"
      >
        Print PDF
      </Button>
    </div>
  );
}
