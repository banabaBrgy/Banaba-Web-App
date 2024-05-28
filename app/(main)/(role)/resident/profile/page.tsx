import { Input } from "@/components/ui/input";
import { getUser } from "@/lib/user";
import Image from "next/image";
import React from "react";

export default async function ProfilePage() {
  const user = await getUser();

  return (
    <div className="sm:px-4 px-3 py-4">
      <h1 className="text-lg uppercase">Profile</h1>

      <h1 className="text-center text-3xl font-semibold mt-4">
        Hi, {user?.fullName}
      </h1>

      <div className="flex gap-8 mt-10 max-w-[50rem] mx-auto">
        <div>
          <Image
            src={user?.profile || "https://via.placeholder.com/400x400"}
            alt="profile"
            width={500}
            height={400}
            priority
            className="w-52 h-52 rounded-md"
          />
        </div>
      </div>
    </div>
  );
}
