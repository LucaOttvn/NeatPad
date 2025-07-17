"use client"
import { User } from "@/utils/interfaces";
import { createContext, ReactNode, useState } from "react";

interface UserContextType {
  user: User | undefined;
  setUser: (user: User | undefined) => void;
  usersEmails: string[]
  setUsersEmails: (user: string[]) => void;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [usersEmails, setUsersEmails] = useState<string[]>([]);

  return (
    <UserContext.Provider value={{ user, setUser, usersEmails, setUsersEmails }}>
      {children}
    </UserContext.Provider>
  );
}
