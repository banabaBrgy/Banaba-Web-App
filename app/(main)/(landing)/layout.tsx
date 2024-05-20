import React, { ReactNode } from "react";
import { Navbar } from "./_components/navbar";
import { Footer } from "./_components/footer";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div id="wrapper">
      <Navbar />
      <div>{children}</div>
      <Footer />
    </div>
  );
}
