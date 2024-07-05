import React, { ReactNode } from "react";
import { Navbar } from "./_components/navbar";
import { Footer } from "./_components/footer";
import Sidebar from "./_components/sidebar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div id="wrapper">
      <Navbar />
      {/*     <Sidebar /> */}
      <div>{children}</div>
      <Footer />
    </div>
  );
}
