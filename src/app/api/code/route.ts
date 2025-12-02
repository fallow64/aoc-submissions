import { USERS } from "@/util/users";
import { NextRequest, NextResponse } from "next/server";

export const revalidate = 900; // Cache for 15 minutes (900 seconds)

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get("username");
  const day = searchParams.get("day");
  const part = searchParams.get("part");

  if (!username || !day || !part) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  }

  const user = USERS.find((u) => u.username === username);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const dayNum = parseInt(day, 10);
  if (isNaN(dayNum) || dayNum < 1 || dayNum > 12) {
    return NextResponse.json({ error: "Invalid day" }, { status: 400 });
  }

  if (part !== "A" && part !== "B") {
    return NextResponse.json({ error: "Invalid part" }, { status: 400 });
  }

  try {
    const path = user.mapToPath(dayNum, part as "A" | "B");
    const branch = user.branch || "main";
    const url = `https://raw.githubusercontent.com/${user.username}/${user.repo}/${branch}/${path}`;

    const response = await fetch(url, {
      next: { revalidate: 900 }, // Cache GitHub response for 15 minutes
    });

    if (!response.ok) {
      const errorLines = [
        `Error fetching file: ${response.statusText}`,
        `URL: ${url}`,
        `Status: ${response.status}`,
      ];
      const commentChar = user.language.toLowerCase() === "python" ? "#" : "//";
      const errorCode = errorLines
        .map((line) => `${commentChar} ${line}`)
        .join("\n");
      return NextResponse.json({ code: errorCode });
    }

    const code = await response.text();
    return NextResponse.json(
      { code },
      {
        headers: {
          "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800",
        },
      }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const commentChar = user.language.toLowerCase() === "python" ? "#" : "//";
    return NextResponse.json({
      code: `${commentChar} Error: ${errorMessage}`,
    });
  }
}
