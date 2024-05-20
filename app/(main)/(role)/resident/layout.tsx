import React, { ReactNode } from "react";

export default function ResidentLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <div>{children}</div>
    </div>
  );
}
