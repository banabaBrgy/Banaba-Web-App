import { getUser } from "@/lib/user";
import Image from "next/image";
import React from "react";
import { IoMdArrowDropdown } from "react-icons/io";

export default async function Navbar() {
  const user = await getUser();

  return (
    <nav className="sticky top-0 flex items-center justify-between ml-[16rem] h-14 px-5 bg-white">
      <h1 className="font-semibold">Dashboard</h1>

      <div className="flex items-center gap-2">
        <Image
          src={user?.profile || "https://via.placeholder.com/400x400"}
          alt="profile"
          width={500}
          height={200}
          priority
          className="w-9 h-9 rounded-full"
        />

        <p className="flex items-center gap-1 text-sm text-gray-500 capitalize">
          {user?.fullName} <IoMdArrowDropdown size={19} />
        </p>
      </div>
    </nav>
  );
}
