"use client";

import ButtonGroup from "@/components/ButtonGroup";
import CodeViewer from "@/components/CodeViewer";
import UserList from "@/components/UserList";
import { PartType, User, USERS } from "@/util/users";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { CodeData } from "@/lib/fetchCode";

interface HomeClientProps {
  allCode: CodeData[];
}

export default function HomeClient({ allCode }: HomeClientProps) {
  const router = useRouter();

  // Initialize from URL params on client side only
  const [selectedUser, setSelectedUser] = useState<User>(USERS[0]);
  const [selectedPart, setSelectedPart] = useState<PartType>("A");
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [isInitialized, setIsInitialized] = useState(false);

  // Read URL params on mount
  useEffect(() => {
    if (typeof window !== "undefined" && !isInitialized) {
      const params = new URLSearchParams(window.location.search);
      const username = params.get("user");
      const part = params.get("part");
      const day = params.get("day");

      if (username) {
        const user = USERS.find((u) => u.username === username);
        if (user) setSelectedUser(user);
      }
      if (part === "B") setSelectedPart("B");
      if (day) {
        const dayNum = parseInt(day, 10);
        if (dayNum >= 1 && dayNum <= 12) setSelectedDay(dayNum);
      }
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // Update URL when state changes
  useEffect(() => {
    if (isInitialized) {
      const params = new URLSearchParams();
      params.set("user", selectedUser.username);
      params.set("part", selectedPart);
      params.set("day", selectedDay.toString());
      router.push(`?${params.toString()}`, { scroll: false });
    }
  }, [selectedUser, selectedPart, selectedDay, router, isInitialized]);

  // Fetch source code from GitHub on demand
  const fetchSourceCode = useCallback(
    async (username: string, day: number, part: PartType): Promise<string> => {
      // If we have pre-loaded data, use it
      if (allCode.length > 0) {
        const codeData = allCode.find(
          (c) => c.username === username && c.day === day && c.part === part
        );
        if (codeData) return codeData.code;
      }

      // Otherwise fetch from GitHub
      const user = USERS.find((u) => u.username === username);
      if (!user) {
        return `// User ${username} not found`;
      }

      try {
        const path = user.mapToPath(day, part);
        const url = `https://raw.githubusercontent.com/${username}/${user.repo}/main/${path}`;

        const response = await fetch(url);

        if (!response.ok) {
          return `// Error fetching file: ${response.statusText}\n// URL: ${url}`;
        }

        return await response.text();
      } catch (error) {
        return `// Error: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
    [allCode]
  );

  return (
    <div className="h-screen bg-bg p-4 pb-8 overflow-hidden">
      <div className="grid grid-cols-[300px_1fr] gap-4 h-full">
        {/* Left: User List */}
        <div className="bg-card p-4 border border-border">
          <h2 className="text-lg font-semibold mb-4">Users</h2>
          <UserList
            users={USERS}
            selectedUser={selectedUser}
            onSelectUser={setSelectedUser}
          />
        </div>

        {/* Right: Controls and Code Viewer */}
        <div className="flex flex-col gap-4 h-full min-h-0">
          <div className="bg-card p-4 border border-border shrink-0">
            <ButtonGroup
              selectedPart={selectedPart}
              selectedDay={selectedDay}
              onSelectPart={setSelectedPart}
              onSelectDay={setSelectedDay}
            />
          </div>
          <div className="bg-card flex-1 overflow-hidden">
            <CodeViewer
              username={selectedUser.username}
              part={selectedPart}
              day={selectedDay}
              language={selectedUser.language}
              fetchSourceCode={fetchSourceCode}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
