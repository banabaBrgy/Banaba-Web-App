import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const documentType = req.nextUrl.searchParams.get("documentType") as string;

    const totalPendingRequest = await db.documentRequest.findMany({
      where: {
        documentType: {
          equals: documentType,
        },
        status: {
          equals: "Pending",
        },
      },
    });

    return NextResponse.json(totalPendingRequest, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
