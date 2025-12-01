"use client";

import { PartType } from "@/util/users";

interface ButtonGroupProps {
  selectedPart: PartType;
  selectedDay: number;
  onSelectPart: (part: PartType) => void;
  onSelectDay: (day: number) => void;
}

export default function ButtonGroup({
  selectedPart,
  selectedDay,
  onSelectPart,
  onSelectDay,
}: ButtonGroupProps) {
  const parts: PartType[] = ["A", "B"];
  const days = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="flex gap-4">
      <div className="flex gap-1">
        {parts.map((part) => (
          <button
            key={part}
            onClick={() => onSelectPart(part)}
            className={`w-12 h-12 font-medium border border-border transition-colors hover:cursor-pointer ${
              selectedPart === part
                ? "bg-accent text-bg"
                : "bg-card hover:bg-accent-hover hover:text-bg"
            }`}
          >
            {part}
          </button>
        ))}
      </div>
      <div className="flex gap-1">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => onSelectDay(day)}
            className={`w-12 h-12 font-medium border border-border transition-colors hover:cursor-pointer ${
              selectedDay === day
                ? "bg-accent text-bg"
                : "bg-card hover:bg-accent-hover hover:text-bg"
            }`}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
}
