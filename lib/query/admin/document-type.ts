import { db } from "@/lib/db";

export async function getDocumentType() {
  try {
    const documentTypes = await db.documentType.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return documentTypes;
  } catch (error) {
    console.log(error);
  }
}
