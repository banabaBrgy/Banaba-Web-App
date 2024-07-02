import { getSystemUsers } from "@/lib/query/admin/system-users";
import React from "react";
import SystemUsersRow from "./_components/system-users-row";
import { getUser } from "@/lib/user";

export default async function SystemUsersPage() {
  const systemUsers = await getSystemUsers();
  const user = await getUser();

  return (
    <div className="md:px-4 px-3 py-4">
      <SystemUsersRow systemUsers={systemUsers} user={user} />
    </div>
  );
}
