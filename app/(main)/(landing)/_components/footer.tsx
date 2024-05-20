"use client";

import Image from "next/image";
import React from "react";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();

  if (pathname === "/") return;

  return (
    <footer className="flex justify-between py-5 px-3 bg-gray-600 text-white">
      <div className="flex flex-col items-center gap-2">
        <Image
          src="/logo.png"
          alt="Logo"
          width={300}
          height={200}
          priority
          className="w-20 h-20"
        />
        <p className="max-w-[10rem] text-center text-sm">
          Together, we make a difference in our barangay.
        </p>
      </div>

      <div className="space-y-3">
        <h1 className="font-bold uppercase">More Pages</h1>

        <ul className="grid grid-cols-2 text-sm gap-2">
          <li>Home</li>
          <li>Profile</li>
          <li>Services</li>
          <li>Terms and Conditions</li>
          <li>Health Center</li>
          <li>Privacy Policy</li>
          <li>About us</li>
          <li>Contact</li>
          <li>FAQ</li>
        </ul>
      </div>
    </footer>
  );
}
