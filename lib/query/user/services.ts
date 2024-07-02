import { db } from "@/lib/db";

export async function getDocumentType() {
  try {
    const documentType = await db.documentType.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return documentType;
  } catch (error: any) {
    console.log(error.message);
  }
}
