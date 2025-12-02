"use client";

import ButtonGroup from "@/components/ButtonGroup";
import CodeViewer from "@/components/CodeViewer";
import UserList from "@/components/UserList";
import { PartType, User, USERS } from "@/util/users";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function HomeClient() {
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
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [selectedUser, selectedPart, selectedDay, router, isInitialized]);

  // Fetch source code from API route
  const fetchSourceCode = useCallback(
    async (username: string, day: number, part: PartType): Promise<string> => {
      const params = new URLSearchParams({
        username,
        day: day.toString(),
        part,
      });

      const response = await fetch(`/api/code?${params.toString()}`);
      if (!response.ok) {
        return `// Error: Failed to fetch code (${response.status})`;
      }

      const data = await response.json();
      return data.code;
    },
    []
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
