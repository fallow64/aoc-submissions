"use client";

import { User } from "@/util/users";

interface UserListProps {
  users: User[];
  selectedUser: User;
  onSelectUser: (user: User) => void;
}

export default function UserList({
  users,
  selectedUser,
  onSelectUser,
}: UserListProps) {
  return (
    <div className="flex flex-col gap-0">
      {users.map((user) => (
        <button
          key={user.username}
          onClick={() => onSelectUser(user)}
          className={`px-4 py-3 text-left transition-colors border border-border hover:cursor-pointer ${
            selectedUser.username === user.username
              ? "bg-accent text-bg [&_.muted-text]:text-bg/70"
              : "bg-card hover:bg-accent-hover hover:text-bg [&_.muted-text]:text-muted hover:[&_.muted-text]:text-bg/70"
          }`}
        >
          <div className="flex justify-between">
            <div className="inline-block">
              <span className="inline-block">{user.username}</span>{" "}
              {user.nickname && (
                <>
                  <span className="inline-block muted-text">
                    ({user.nickname})
                  </span>{" "}
                </>
              )}
            </div>
            <span className="inline-block muted-text ml-auto">
              {user.language}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
