"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createDocument(formData: FormData) {
  try {
    const document = formData.get("document") as string;

    const isDocumentExist = await db.documentType.findUnique({
      where: {
        document,
      },
    });

    if (isDocumentExist) {
      return { error: "Document is already exist" };
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
