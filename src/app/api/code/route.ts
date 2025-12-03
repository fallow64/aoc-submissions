import { wrapComments } from "@/util/comment";
import { PartType, USERS } from "@/util/users";
import { NextRequest, NextResponse } from "next/server";

export const CACHE_REVLIDATE = 15 * 60;
export const CACHE_STALE_WHILE_REVALIDATE = 30 * 60;

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
    const path = user.mapToPath(dayNum, part as PartType);
    const branch = user.branch || "main";
    const url = `https://raw.githubusercontent.com/${user.username}/${user.repo}/${branch}/${path}`;

    const response = await fetch(url, {
      // ensure we cache response
      next: { revalidate: CACHE_REVLIDATE },
    });

    if (!response.ok) {
      const errorLines = [
        `Error fetching file: ${response.statusText}`,
        `URL: ${url}`,
        `Status: ${response.status}`,
      ];
      return NextResponse.json({
        code: wrapComments(errorLines, user.language),
      });
    }

    const code = await response.text();
    return NextResponse.json(
      { code },
      {
        headers: {
          "Cache-Control": `public, s-maxage=${CACHE_REVLIDATE}, stale-while-revalidate=${CACHE_STALE_WHILE_REVALIDATE}`,
        },
      }
    );
  } catch (error) {
    const errorLines = [
      error instanceof Error ? error.message : "Unknown error",
    ];
    return NextResponse.json({
      code: wrapComments(errorLines, user.language),
    });
  }
}
