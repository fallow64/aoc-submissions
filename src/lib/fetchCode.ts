import { PartType, User, USERS } from "@/util/users";

export interface CodeData {
  username: string;
  day: number;
  part: PartType;
  code: string;
}

function wrapComment(lines: string[], language: string): string {
  const commentStyle: Record<
    string,
    { start?: string; end?: string; line?: string }
  > = {
    rust: { line: "//" },
    python: { line: "#" },
    javascript: { line: "//" },
    typescript: { line: "//" },
    java: { line: "//" },
    c: { line: "//" },
    cpp: { line: "//" },
    go: { line: "//" },
    ruby: { line: "#" },
    php: { line: "//" },
    swift: { line: "//" },
    kotlin: { line: "//" },
    scala: { line: "//" },
    r: { line: "#" },
    perl: { line: "#" },
    shell: { line: "#" },
    bash: { line: "#" },
    lua: { line: "--" },
    sql: { line: "--" },
    html: { start: "<!--", end: "-->" },
    xml: { start: "<!--", end: "-->" },
    css: { start: "/*", end: "*/" },
  };

  const style = commentStyle[language.toLowerCase()] || { line: "//" };

  if (style.line) {
    return lines.map((line) => `${style.line} ${line}`).join("\n");
  } else if (style.start && style.end) {
    return `${style.start}\n${lines.join("\n")}\n${style.end}`;
  }

  return lines.join("\n");
}

async function fetchBatch<T>(
  items: T[],
  batchSize: number,
  fetchFn: (item: T) => Promise<any>
): Promise<any[]> {
  const results = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(fetchFn));
    results.push(...batchResults);
  }
  return results;
}

export async function fetchAllCode(): Promise<CodeData[]> {
  const parts: PartType[] = ["A", "B"];
  const days = Array.from({ length: 12 }, (_, i) => i + 1);

  // Build all fetch tasks
  const fetchTasks = USERS.flatMap((user) =>
    days.flatMap((day) => parts.map((part) => ({ user, day, part })))
  );

  const fetchFn = async ({
    user,
    day,
    part,
  }: {
    user: User;
    day: number;
    part: PartType;
  }) => {
    try {
      const path = user.mapToPath(day, part);
      const url = `https://raw.githubusercontent.com/${user.username}/${user.repo}/${user.branch}/${path}`;

      const response = await fetch(url, {
        next: { revalidate: false },
      });

      if (!response.ok) {
        if (response.status !== 404) {
          console.error(
            `Error fetching ${url}: ${response.status} ${response.statusText}`
          );
        }
      }

      const code = response.ok
        ? await response.text()
        : wrapComment(
            [
              `Error fetching file: ${response.statusText}`,
              `URL: ${url}`,
              `Status: ${response.status}`,
            ],
            user.language
          );

      return {
        username: user.username,
        day,
        part,
        code,
      };
    } catch (error) {
      return {
        username: user.username,
        day,
        part,
        code: wrapComment(
          [
            `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
          ],
          user.language
        ),
      };
    }
  };

  // Execute in batches of 10 concurrent requests
  const allCode = await fetchBatch(fetchTasks, 10, fetchFn);
  return allCode;
}
