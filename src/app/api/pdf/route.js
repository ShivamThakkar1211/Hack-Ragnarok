// /app/api/pdf/route.js (App Router)

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/helpers/dbConnect";
import User from "@/models/User";

export async function GET(req) {
  await dbConnect;

  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await User.findOne({ email: session.user.email });

    if (!user || !user.pdf) {
      return NextResponse.json({ error: "No PDF found" }, { status: 404 });
    }

    const pdf = user.pdf;

    const headers = new Headers();
    headers.append("Content-Type", pdf.contentType);
    headers.append("Content-Disposition", `inline; filename=\"${pdf.filename}\"`);

    return new NextResponse(pdf.data, {
      status: 200,
      headers,
    });

  } catch (error) {
    console.error("Error fetching PDF:", error);
    return NextResponse.json({ error: "Failed to fetch PDF" }, { status: 500 });
  }
}