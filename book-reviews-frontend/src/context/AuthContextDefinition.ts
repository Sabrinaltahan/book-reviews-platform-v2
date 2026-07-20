import { createContext } from "react";

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
}

export const AuthContext =
  createContext<AuthContextValue | undefined>(undefined);