"use client";

import React from "react";
import CountUp from "react-countup";

export function CountUpAnimation({ total }: { total: number }) {
  return (
    <p className="text-3xl font-black">
      <CountUp end={total} />
    </p>
  );
}
