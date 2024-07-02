import { UserType } from "@/lib/user";

export function incompleteProfileInfo(user: UserType | null) {
  if (
    !user?.birthDate ||
    !user?.age ||
    !user?.gender ||
    !user?.civilStatus ||
    !user?.placeOfBirth ||
    !user?.sitioPurok ||
    !user?.mobile
  ) {
    throw new Error("Please complete your profile info");
  }
}
