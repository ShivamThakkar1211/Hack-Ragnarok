import { NextResponse } from "next/server";
import dbConnect from "@/helpers/dbConnect";   // MongoDB connection
import User from "@/models/User";          // Your User schema

export async function GET() {
  await dbConnect();

  try {
    const user = await User.findOne();   // Get the first user with a PDF
    if (!user || !user.pdf) {
      return NextResponse.json({ error: "No PDF found" }, { status: 404 });
    }

    const pdf = user.pdf;

    // Set headers for PDF download
    const headers = new Headers();
    headers.append("Content-Type", pdf.contentType);
    headers.append("Content-Disposition", `inline; filename="${pdf.filename}"`);

    return new NextResponse(pdf.data, {
      status: 200,
      headers
    });

  } catch (error) {
    console.error("Error fetching PDF:", error);
    return NextResponse.json({ error: "Failed to fetch PDF" }, { status: 500 });
  }
}
