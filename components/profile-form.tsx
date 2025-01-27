"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserType } from "@/lib/user";
import Image from "next/image";
import React, { Fragment, useState, useTransition } from "react";
import { RiUploadCloud2Fill } from "react-icons/ri";
import { logout } from "@/action/auth";
import { toast } from "sonner";
import { CircleAlert, Loader2 } from "lucide-react";
import { editProfile } from "@/action/profile";
import { useEdgeStore } from "@/lib/edgestore";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface ProfileFormProp {
  user: UserType | null;
}

export function ProfileForm({ user }: ProfileFormProp) {
  const [pendingLogout, setLogoutTransition] = useTransition();
  const [choosenFile, setChoosenFile] = useState("");
  const [pending, setTransition] = useTransition();
  const { edgestore } = useEdgeStore();
  const [profile, setProfile] = useState<File | null>(null);

  function handleFormAction(formData: FormData) {
    const acceptedMimeType = [
      "image/webp",
      "image/jpg",
      "image/jpeg",
      "image/png",
    ];

    if (profile && !acceptedMimeType.includes(profile?.type as string)) {
      return toast.error("Invalid image type");
    }

    setTransition(async () => {
      let res;

      if (profile) {
        res = await edgestore.publicFiles.upload({
          file: profile as File,
          options: {
            replaceTargetUrl: (user?.profile as string) || "",
          },
        });
      }

      const url = res?.url || user?.profile;

      await editProfile(formData, url)
        .then(() => {
          toast.success("Save changes successfully");
          setProfile(null);
          setChoosenFile("");
        })
        .catch(() => toast.error("Something went wrong"));
    });
  }

  const missingProfileInfo =
    !user?.birthDate ||
    !user?.age ||
    !user?.gender ||
    !user?.civilStatus ||
    !user?.placeOfBirth ||
    !user?.sitioPurok;

  return (
    <Fragment>
      <div className="md:block flex justify-center shrink-0">
        <div className="relative">
          <Image
            src={user?.profile || "/no-profile.webp"}
            alt="profile"
            width={500}
            height={400}
            priority
            className="sm:w-52 w-44 sm:h-52 h-44 object-cover rounded-full"
          />
          <label htmlFor="profile" className="cursor-pointer">
            {choosenFile ? (
              <div className="absolute bottom-0 left-0">
                <Image
                  src={choosenFile}
                  alt="profile"
                  width={500}
                  height={200}
                  priority
                  className="w-7 h-7 rounded-full object-cover"
                />
              </div>
            ) : (
              <RiUploadCloud2Fill className="absolute bottom-0 left-0 scale-[1.5] text-green-600" />
            )}
          </label>
          <input
            type="file"
            accept="image/webp, image/jpg, image/jpeg, image/png"
            onChange={(e) => {
              setProfile(e.target.files?.[0] as File);
              if (e.target.files?.length) {
                setChoosenFile(
                  URL.createObjectURL((e.target.files?.[0] as File) || "")
                );
              }
            }}
            id="profile"
            className="hidden"
          />
        </div>
      </div>

      <div className="w-full">
        {missingProfileInfo && (
          <Alert
            className="mb-5 px-4 py-2 bg-destructive/10"
            variant="destructive"
          >
            <AlertDescription className="flex items-center gap-3">
              <CircleAlert className="h-4 w-4 shrink-0" />
              Complete your profile information.
            </AlertDescription>
          </Alert>
        )}

        <form
          action={handleFormAction}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <div className="space-y-2">
            <label htmlFor="firstName" className="text-sm">
              First name
            </label>
            <Input
              type="text"
              name="firstName"
              id="firstName"
              defaultValue={user?.firstName}
              maxLength={20}
              placeholder="Enter your first name"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="lastName" className="text-sm">
              Last name
            </label>
            <Input
              type="text"
              name="lastName"
              id="lastName"
              defaultValue={user?.lastName}
              placeholder="Enter your last name"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="birthDate"
              className={cn("text-sm", !user?.birthDate && "text-red-500")}
            >
              Birth date
            </label>
            <Input
              type="date"
              name="birthDate"
              id="birthDate"
              defaultValue={user?.birthDate || ""}
              placeholder="Enter your birth date"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="age"
              className={cn("text-sm", !user?.birthDate && "text-red-500")}
            >
              Age
            </label>
            <Input
              type="number"
              name="age"
              id="age"
              defaultValue={user?.age || ""}
              placeholder="Enter your age"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="gender"
              className={cn("text-sm", !user?.birthDate && "text-red-500")}
            >
              Gender
            </label>
            <select
              name="gender"
              id="gender"
              defaultValue={user?.gender || ""}
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="civilStatus"
              className={cn("text-sm", !user?.birthDate && "text-red-500")}
            >
              Civil status
            </label>
            <select
              name="civilStatus"
              id="civilStatus"
              required
              defaultValue={user?.civilStatus || ""}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
            >
              <option value="">Select civil status</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
            </select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="placeOfBirth"
              className={cn("text-sm", !user?.birthDate && "text-red-500")}
            >
              Place of birth
            </label>
            <Input
              type="text"
              name="placeOfBirth"
              id="placeOfBirth"
              defaultValue={user?.placeOfBirth || ""}
              placeholder="Enter your place of birth"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="sitioPurok"
              className={cn("text-sm", !user?.birthDate && "text-red-500")}
            >
              Sitio/Purok
            </label>
            <Input
              type="text"
              name="sitioPurok"
              id="sitioPurok"
              defaultValue={user?.sitioPurok || ""}
              placeholder="Enter your sitio purok"
              required
            />
          </div>

          <Button
            disabled={pending || !user}
            className="bg-green-500 hover:bg-green-500/80 uppercase text-xs sm:col-span-2 mt-3"
          >
            {pending ? <Loader2 className="animate-spin" /> : "Save changes"}
          </Button>
        </form>

        <div className="flex justify-center mt-8 text-sm">
          <button
            disabled={pendingLogout}
            onClick={() =>
              setLogoutTransition(async () =>
                logout().then(() => window.location.reload())
              )
            }
            className="uppercase text-red-500"
          >
            {pendingLogout ? <Loader2 className="animate-spin" /> : "Log out"}
          </button>
        </div>
      </div>
    </Fragment>
  );
}
