import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const documentType = req.nextUrl.searchParams.get("documentType");

  try {
    const totalDisapprovedRequest = await db.documentRequest.findMany({
      where: {
        documentType: documentType as string,
        status: "Disapproved",
      },
    });

    return NextResponse.json(totalDisapprovedRequest, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return new Response(error.message, { status: 500 });
  }
};
