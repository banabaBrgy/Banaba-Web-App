import { ProfileForm } from "@/components/profile-form";
import { getUser } from "@/lib/user";
import React from "react";

export default async function ProfilePage() {
  const user = await getUser();

  return (
    <div className="sm:px-4 px-3 py-4 pb-20">
      <h1 className="text-lg uppercase">Profile</h1>

      <h1 className="text-center sm:text-3xl text-2xl font-semibold mt-4">
        Hi, {user?.fullName}
      </h1>

      <div className="flex md:flex-row flex-col gap-8 mt-10 max-w-[60rem] mx-auto">
        <ProfileForm user={user} />
      </div>
    </div>
  );
}
