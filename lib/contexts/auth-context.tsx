"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "../services/user-service";

interface AuthContextType {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Load user from localStorage on mount
        const savedUser = localStorage.getItem("crm-user");
        if (savedUser) {
            try {
                const parsedUser = JSON.parse(savedUser);
                // Use a functional update to avoid synchronous dependency warning if needed,
                // and wrap in Promise to avoid cascading render warning.
                Promise.resolve().then(() => {
                    setUser(parsedUser);
                    setIsLoading(false);
                });
                return;
            } catch (err) {
                console.error("Failed to parse saved user", err);
                localStorage.removeItem("crm-user");
            }
        }
        setIsLoading(false);
    }, []);

    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem("crm-user", JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("crm-user");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
