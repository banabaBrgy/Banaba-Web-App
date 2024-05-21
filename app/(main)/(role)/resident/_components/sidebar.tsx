import Image from "next/image";
import React from "react";

export default function Sidebar() {
  return (
    <div className="fixed inset-y-0 left-0 w-[16rem] bg-white">
      <div className="flex items-center gap-2 p-5">
        <Image
          src="/logo.png"
          alt="Logo"
          width={400}
          height={399}
          priority
          className="w-11 h-11 rounded-full"
        />
        <h1 className="uppercase font-bold sm:block hidden text-sm">
          Barangay Banaba East Batangas City
        </h1>
      </div>
    </div>
  );
}
