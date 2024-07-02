import { db } from "@/lib/db";

export async function getAccounts() {
  try {
    const accounts = await db.user.findMany({
      where: { role: { not: "Admin" } },
    });

    return accounts;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
}
