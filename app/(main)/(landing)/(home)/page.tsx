import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function HomePage() {
  return (
    <div className="waves-top flex gap-14 min-h-[100dvh]">
      <div className="flex flex-col gap-3 items-center justify-center basis-[35rem] lg:mx-0 mx-auto pl-3 pr-3 lg:pr-0">
        <div className="shrink-0">
          <Image
            src="/logo.png"
            alt="Logo"
            width={500}
            height={500}
            priority
            className="lg:w-60 lg:h-60 w-52 h-52"
          />
        </div>

        <h1 className="sm:text-5xl text-4xl text-center sm:leading-tight leading-tight font-bold mx-3">
          Barangay Banaba East Batangas City
        </h1>

        <div className="flex items-center gap-5 mt-4 text-white text-sm">
          <Link
            href="/log-in"
            className="flex-1 bg-gradient-to-r from-green-600 via-green-500 to-green-400 px-10 py-3 rounded-md active:scale-[.98] uppercase text-xs"
          >
            Log in
          </Link>

          {/* <span className="relative bg-green-600 rounded-full h-[1.5rem] w-[1.5rem]">
            <span className="absolute inset-0 animate-ping bg-green-600 rounded-full h-[1.5rem] w-[1.5rem]" />
          </span> */}

          <Link
            href="/register"
            className="flex-1 bg-gradient-to-r from-green-600 via-green-500 to-green-400 px-10 py-3 rounded-md active:scale-[.98] uppercase text-xs"
          >
            Register
          </Link>
        </div>
      </div>

      <div className="relative flex-1 pr-3 lg:block hidden overflow-hidden">
        <div
          className="absolute inset-0 z-[10] rounded-l-[400px]"
          style={{
            background: `url(/brg-bg.jpg)`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "100% 100%",
          }}
        />
      </div>
    </div>
  );
}
