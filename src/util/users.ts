export type PartType = "A" | "B";

export interface User {
  /** GitHub username */
  username: string;
  nickname?: string;
  language: string;
  repo: string;
  branch: string;
  mapToPath(day: number, part: PartType): string;
}

export const USERS: User[] = [
  {
    username: "fallow64",
    nickname: "Austin",
    language: "Rust",
    repo: "aoc25",
    branch: "main",
    mapToPath: (day, part) =>
      `src/day${day}/part${part === "A" ? "1" : "2"}.rs`,
  },
  {
    username: "AndrewDTR",
    nickname: "Andrew",
    language: "Python",
    repo: "aoc2025",
    branch: "main",
    mapToPath: (day, part) => `pub/${day}/${part.toLowerCase()}.py`,
  },
  {
    username: "nicosalm",
    nickname: "Nico",
    language: "Python",
    repo: "advent-of-code",
    branch: "main",
    mapToPath: (day, part) =>
      `2025/day${day.toString().padStart(2, "0")}/${part === "A" ? "1" : "2"}.py`,
  },
];
