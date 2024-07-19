"use client";

import Image from "next/image";
import React from "react";
import { usePathname } from "next/navigation";
import { FaFacebook } from "react-icons/fa";
import Link from "next/link";

export function Footer() {
  const pathname = usePathname();

  if (pathname === "/") return;

  return (
    <footer className="border-zinc-300 border-t bg-zinc-400 text-white">
      <div className="flex lg:flex-row flex-col gap-20 justify-between px-3 md:px-20 py-8">
        <div className="flex flex-col items-center gap-5">
          <Image
            src="/logo.png"
            alt="Logo"
            width={300}
            height={200}
            priority
            className="w-44 h-44"
          />
          <p className="font-semibold uppercase w-60 text-center">
            Together, we make a difference in our barangay.
          </p>
        </div>

        <div className="flex sm:flex-row flex-col lg:gap-28 gap-16">
          <div className="flex flex-col gap-5 text-sm">
            <h1 className="font-bold text-lg uppercase">More pages</h1>

            <Link className="hover:underline" href="/">
              Home
            </Link>
            <Link className="hover:underline" href="/service">
              Service
            </Link>
            <Link className="hover:underline" href="/health-center">
              Health Center
            </Link>
            <Link className="hover:underline" href="/about-us">
              About us
            </Link>
            <Link className="hover:underline" href="/faq">
              Faq
            </Link>
            <Link className="hover:underline" href="/terms-and-conditions">
              Terms and conditions
            </Link>
          </div>

          <div className="flex flex-col gap-5 text-sm">
            <h1 className="font-bold text-lg uppercase">Visit us</h1>

            <a
              className="hover:underline flex gap-3"
              target="_blank"
              href="https://www.facebook.com/barangay.banabasilangan.3?mibextid=ZbWKwL"
            >
              <FaFacebook className="text-blue-600 scale-[1.8]" /> Our facebook
              page
            </a>
            <div></div>
          </div>
        </div>
      </div>

      <div className="bg-black text-xs text-center p-2">
        <p>© 2024 | COPYRIGHT: BARANGAY BANABA EAST BATANGAS CITY</p>
      </div>
    </footer>
  );
}
