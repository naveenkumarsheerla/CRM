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
                
                // Check if token is expired on load
                if (parsedUser.token) {
                    try {
                        const payload = JSON.parse(atob(parsedUser.token.split('.')[1]));
                        if (payload.exp && payload.exp * 1000 < Date.now()) {
                            console.log("Token expired, requiring new login.");
                            localStorage.removeItem("crm-user");
                            setIsLoading(false);
                            return;
                        }
                    } catch (e) {
                        // ignore error
                    }
                }

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

    useEffect(() => {
        if (!user || !user.token) return;

        const checkToken = () => {
            try {
                const payload = JSON.parse(atob(user.token!.split('.')[1]));
                if (payload.exp && payload.exp * 1000 < Date.now()) {
                    logout();
                    window.location.href = "/login";
                }
            } catch (e) {
                // ignore
            }
        };

        const intervalId = setInterval(checkToken, 60000); // Check every minute
        return () => clearInterval(intervalId);
    }, [user]);

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
