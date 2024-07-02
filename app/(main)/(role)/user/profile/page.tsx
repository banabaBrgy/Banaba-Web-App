import { getUser } from "@/lib/user";
import React from "react";
import { ProfileForm } from "@/components/profile-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SecurityForm from "@/components/security-form";
import { FaExclamation } from "react-icons/fa";

export default async function ProfilePage() {
  const user = await getUser();

  const missingProfileInfo =
    !user?.birthDate ||
    !user?.age ||
    !user?.gender ||
    !user?.civilStatus ||
    !user?.placeOfBirth ||
    !user?.sitioPurok;

  return (
    <div className="sm:px-4 px-3 py-4">
      <Tabs defaultValue="profile" className=" w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile" className="flex items-center gap-1">
            Profile{" "}
            {missingProfileInfo && (
              <FaExclamation className="text-red-500" size={13} />
            )}
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-1">
            Security{" "}
            {!user?.mobile && (
              <FaExclamation className="text-red-500" size={13} />
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Make changes to your profile here. Click save when you&apos;re
                done.
              </CardDescription>
            </CardHeader>

            <CardHeader>
              <CardTitle className="text-center">
                Hi, {user?.fullName}
              </CardTitle>
            </CardHeader>

            <CardContent className="flex md:flex-row flex-col gap-8 mt-5">
              <ProfileForm user={user} />
            </CardContent>
          </Card>
        </TabsContent>

        <SecurityForm user={user} />
      </Tabs>
    </div>
  );
}
