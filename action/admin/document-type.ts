"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createDocument(formData: FormData) {
  try {
    const document = formData.get("document") as string;

    if (!document) {
      throw new Error("Document is required");
    }

    const isDocumentExist = await db.documentType.findUnique({
      where: {
        document,
      },
    });

    if (isDocumentExist) {
      throw new Error("Document is already exist");
    }

    await db.documentType.create({
      data: {
        document,
      },
    });

    revalidatePath("/");
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function deleteDocument(documentId: string) {
  try {
    await db.documentType.delete({
      where: {
        id: documentId,
      },
    });

    revalidatePath("/");
  } catch (error: any) {
    throw new Error(error.message);
  }
}
