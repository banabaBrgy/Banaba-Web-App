import { db } from "./db";

export async function getPinnedInquiries() {
  const pinnedInquiries = await db.inquiries.findMany({
    where: {
      isPinned: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return pinnedInquiries;
}
