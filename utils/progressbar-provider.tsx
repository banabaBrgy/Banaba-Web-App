"use client";

import React, { Fragment, ReactNode } from "react";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

export default function ProgressBarProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Fragment>
      {children}
      <ProgressBar
        height="3px"
        color="red"
        options={{ showSpinner: false }}
        shallowRouting
        stopDelay={0}
        startPosition={0.1}
      />
    </Fragment>
  );
}
