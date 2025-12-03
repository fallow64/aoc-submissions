"use client";

import { PartType, User } from "@/util/users";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeViewerProps {
  user: User;
  part: PartType;
  day: number;
  fetchSourceCode: (
    username: string,
    day: number,
    part: PartType
  ) => Promise<string>;
}

export default function CodeViewer({
  user,
  part,
  day,
  fetchSourceCode,
}: CodeViewerProps) {
  const [code, setCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const githubUrl = `https://github.com/${user.username}/${user.repo}/blob/${user.branch}/${user.mapToPath(day, part)}`;

  useEffect(() => {
    setIsLoading(true);
    fetchSourceCode(user.username, day, part)
      .then((result) => {
        setCode(result);
        setIsLoading(false);
      })
      .catch((error) => {
        setCode(`// Error: ${error.message}`);
        setIsLoading(false);
      });
  }, [user.username, day, part, fetchSourceCode]);

  return (
    <div className="border border-border h-full flex flex-col">
      <div className="bg-bg px-4 py-2 border-b border-border flex items-center justify-between">
        <div>
          <div className="text-sm font-medium">
            {user.username} / Day {day} / Part {part}
            {isLoading && (
              <span className="ml-2 text-xs text-muted animate-pulse">
                Loading...
              </span>
            )}
          </div>
          <div className="text-xs text-muted">{user.language}</div>
        </div>
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs px-3 py-1 bg-accent hover:bg-accent/80 text-bg rounded transition-colors"
        >
          Open in GitHub
          <Image
            src="/external-link-icon.svg"
            alt="(opens in new tab)"
            width={12}
            height={12}
            className="inline-block ml-1 mb-0.5"
          />
        </a>
      </div>
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="p-4 text-muted animate-pulse">Loading code...</div>
        ) : (
          <SyntaxHighlighter
            language={user.language.toLowerCase()}
            style={oneDark}
            customStyle={{
              height: "100%",
              width: "100%",
              margin: 0,
              padding: "1rem",
              background: "transparent",
            }}
            codeTagProps={{
              style: { background: "transparent" },
            }}
          >
            {code}
          </SyntaxHighlighter>
        )}
      </div>
    </div>
  );
}
