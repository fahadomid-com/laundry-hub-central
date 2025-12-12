import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const USERS_KEY = "laundry_admin_users";
const SESSION_KEY = "laundry_admin_session";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedSession = localStorage.getItem(SESSION_KEY);
    if (savedSession) {
      try {
        setUser(JSON.parse(savedSession));
      } catch {
        localStorage.removeItem(SESSION_KEY);
      }
    }
  }, []);

  const getUsers = (): Record<string, { password: string; user: User }> => {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
    } catch {
      return {};
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const users = getUsers();
    const userRecord = users[email.toLowerCase()];

    if (!userRecord) {
      return { success: false, error: "No account found with this email" };
    }

    if (userRecord.password !== password) {
      return { success: false, error: "Incorrect password" };
    }

    setUser(userRecord.user);
    localStorage.setItem(SESSION_KEY, JSON.stringify(userRecord.user));
    return { success: true };
  };

  const signup = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    const users = getUsers();
    const emailLower = email.toLowerCase();

    if (users[emailLower]) {
      return { success: false, error: "An account with this email already exists" };
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      email: emailLower,
      name,
    };

    users[emailLower] = { password, user: newUser };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    setUser(newUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(updatedUser));

    const users = getUsers();
    if (users[user.email]) {
      users[user.email].user = updatedUser;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
