"use client";

import { changeRole } from "@/action/admin/system-users";
import { Input } from "@/components/ui/input";
import { UserType } from "@/lib/user";
import { cn } from "@/lib/utils";
import React, { ChangeEvent, useState, useTransition } from "react";
import { MdOutlineSearch } from "react-icons/md";
import { toast } from "sonner";

interface SystemUsersRowProp {
  systemUsers: UserType[] | null;
  user: UserType | null;
}

export default function SystemUsersRow({
  systemUsers,
  user,
}: SystemUsersRowProp) {
  const [search, setSearch] = useState("");
  const [pending, setTransition] = useTransition();

  const tableHead = [
    "No.",
    "Fullname",
    "Email address",
    "Mobile",
    "Role",
    "Status",
  ];

  function onChangeRole(
    e: ChangeEvent<HTMLSelectElement>,
    systemUser: UserType
  ) {
    setTransition(async () => {
      await changeRole(systemUser.id, e.target.value as "Admin" | "User").then(
        () =>
          toast.success(
            `${systemUser.fullName} change role to ${e.target.value}`
          )
      );
    });
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-lg uppercase">System User&apos;s</h1>

        <div className="relative flex items-center flex-1 max-w-[20rem]">
          <MdOutlineSearch className="absolute right-3 scale-[1.4] text-zinc-400" />
          <Input
            onChange={(e) => setSearch(e.target.value.toLowerCase())}
            type="text"
            placeholder="Search"
            className="pr-10"
          />
        </div>
      </div>

      <div className="overflow-auto mt-4">
        <table className="border-collapse w-full bg-white">
          <thead>
            <tr>
              {tableHead.map((th) => (
                <th
                  key={th}
                  className="border border-green-500 bg-green-500 p-2 text-white font-normal uppercase whitespace-nowrap text-sm"
                >
                  {th}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {systemUsers
              ?.filter(
                (systemUser) =>
                  systemUser.fullName.toLowerCase().includes(search) ||
                  systemUser.email.toLowerCase().includes(search) ||
                  systemUser.mobile?.includes(search) ||
                  systemUser.role?.toLowerCase().includes(search)
              )
              .map((systemUser, idx) => (
                <tr
                  key={systemUser.id}
                  className="text-center text-sm hover:bg-zinc-50"
                >
                  <td className="p-2 border border-[#dddddd]">{idx + 1}.</td>
                  <td className="p-2 border border-[#dddddd]">
                    {systemUser.fullName}
                  </td>
                  <td className="p-2 border border-[#dddddd]">
                    {systemUser.email}
                  </td>
                  <td className="p-2 border border-[#dddddd]">
                    {systemUser.mobile}
                  </td>
                  <td className="p-2 border border-[#dddddd]">
                    <select
                      onChange={(e) => onChangeRole(e, systemUser)}
                      disabled={pending || user?.id === systemUser.id}
                      defaultValue={systemUser.role}
                      className="p-2 border border-zinc-300 rounded-m w-full"
                    >
                      <option value="Admin">Admin</option>
                      <option value="User">User</option>
                    </select>
                  </td>
                  <td
                    className={cn("p-2 border border-[#dddddd] text-red-500")}
                  >
                    INACTIVE
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
