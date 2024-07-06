import React, { ReactNode } from "react";
import { Sidebar } from "./_components/sidebar";
import { getUser } from "@/lib/user";
import { getRequestPending } from "@/lib/query/admin/request-pending";
import { Navbar } from "./_components/navbar";
import { getNoAnswersInquiries } from "@/lib/query/admin/inquiries";

export default async function Layout({ children }: { children: ReactNode }) {
  const user = await getUser();
  const pendingRequest = await getRequestPending();
  const noAnswersInquiries = await getNoAnswersInquiries();

  return (
    <div className="min-h-[100dvh] bg-gray-100">
      <Navbar user={user} />
      <Sidebar
        user={user}
        pendingRequest={pendingRequest}
        noAnswersInquiries={noAnswersInquiries}
      />
      <div className="lg:ml-[16rem]">{children}</div>
    </div>
  );
}
