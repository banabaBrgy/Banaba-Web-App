import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function HomePage() {
  return (
    <div className="waves-top flex gap-14 min-h-[100dvh]">
      <div className="flex flex-col gap-3 items-center justify-center basis-[35rem] lg:mx-0 mx-auto pl-3 pr-3 lg:pr-0">
        <div className="slide-up shrink-0">
          <Image
            src="/logo.png"
            alt="Barangay Banaba Logo"
            width={800}
            height={500}
            priority
            className="lg:w-56 lg:h-56 w-52 h-52"
          />
        </div>

        <h1 className="slide-up sm:text-5xl text-4xl text-center sm:leading-tight leading-tight font-bold mx-3">
          Barangay Banaba East Batangas City
        </h1>

        <div className="slide-up flex items-center mt-4 text-white text-sm bg-gradient-to-t from-green-600 via-green-500 to-green-400 rounded-md">
          <Link
            href="/log-in"
            className="flex-1 px-10 py-4 active:scale-[.98] uppercase text-xs"
          >
            Log in
          </Link>

          <span className="border border-gray-300 h-4" />

          <Link
            href="/register"
            className="flex-1 px-10 py-4 active:scale-[.98] uppercase text-xs"
          >
            Register
          </Link>
        </div>
      </div>

      <div className="relative flex-1 pr-3 lg:block hidden overflow-hidden">
        <div
          className="absolute inset-0 z-[10] rounded-l-[400px]"
          //BARANGAY HALL IMAGE URL: /bgy-bg.jpg
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
