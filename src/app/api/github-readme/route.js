// app/api/github-readme/route.js
import { NextResponse } from "next/server";

export async function GET(request) {
  // Extract query parameters
  const { searchParams } = new URL(request.url);
  const repoOwner = searchParams.get("repoOwner");
  const repoName = searchParams.get("repoName");

  // Validate query parameters
  if (!repoOwner || !repoName) {
    return NextResponse.json(
      { error: "Please provide repoOwner and repoName" },
      { status: 400 }
    );
  }

  // Construct GitHub API URL
  const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/readme`;

  try {
    // Fetch README from GitHub
    const response = await fetch(apiUrl, {
      headers: {
        Accept: "application/vnd.github.v3+json", // Use JSON response
      },
    });

    // Handle GitHub API errors
    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch readme data from GitHub" },
        { status: response.status }
      );
    }

    // Parse the GitHub API response
    const data = await response.json();

    // Decode the base64 README content
    const decodedContent = Buffer.from(data.content, "base64").toString("utf-8");

    // Return the decoded content
    return NextResponse.json({ content: decodedContent }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong while fetching the readme" },
      { status: 500 }
    );
  }
}