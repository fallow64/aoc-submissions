import { PartType, USERS } from "@/util/users";

export interface CodeData {
  username: string;
  day: number;
  part: PartType;
  code: string;
}

export async function fetchAllCode(): Promise<CodeData[]> {
  const allCode: CodeData[] = [];
  const parts: PartType[] = ["A", "B"];
  const days = Array.from({ length: 12 }, (_, i) => i + 1);

  for (const user of USERS) {
    for (const day of days) {
      for (const part of parts) {
        try {
          const path = user.mapToPath(day, part);
          const url = `https://raw.githubusercontent.com/${user.username}/${user.repo}/main/${path}`;

          const headers: HeadersInit = {
            "User-Agent": "NextJS-Static-Site",
          };

          if (process.env.GITHUB_TOKEN) {
            headers["Authorization"] = `token ${process.env.GITHUB_TOKEN}`;
          }

          // Add small delay to avoid rate limiting
          await new Promise((resolve) => setTimeout(resolve, 100));

          const response = await fetch(url, {
            headers,
            next: { revalidate: false },
          });

          if (!response.ok) {
            console.error(
              `Failed to fetch ${url}: ${response.status} ${response.statusText}`
            );
          }

          const code = response.ok
            ? await response.text()
            : `// Error fetching file: ${response.statusText}\n// URL: ${url}\n// Status: ${response.status}`;

          allCode.push({
            username: user.username,
            day,
            part,
            code,
          });
        } catch (error) {
          allCode.push({
            username: user.username,
            day,
            part,
            code: `// Error: ${error instanceof Error ? error.message : "Unknown error"}`,
          });
        }
      }
    }
  }

  return allCode;
}
