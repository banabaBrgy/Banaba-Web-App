import Assistant from "@/components/assistant";
import { getUser } from "@/lib/user";
import React, { ReactNode } from "react";

export default async function MainLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getUser();

  return (
    <div>
      <Assistant user={user} />
      <main>{children}</main>
    </div>
  );
}
