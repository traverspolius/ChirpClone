import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, setAccessToken } from "../api/client";
import type { User } from "../types";

type AuthState = {
    user: User | null;
    token: string | null;
    login: (emailOrHandle: string, password: string) => Promise<void>;
    register: (handle: string, displayName: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    tryRefresh: () => Promise<void>;
};

const Ctx = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    const applyAuth = (auth: any) => {
        setToken(auth.accessToken);
        setAccessToken(auth.accessToken);
        setUser({ id: auth.userId, handle: auth.handle, displayName: auth.displayName });
    };

    const login = async (emailOrHandle: string, password: string) => {
        const { data } = await api.post("/auth/login", { emailOrHandle, password });
        applyAuth(data);
    };

    const register = async (handle: string, displayName: string, email: string, password: string) => {
        const { data } = await api.post("/auth/register", { handle, displayName, email, password });
        applyAuth(data);
    };

    const tryRefresh = async () => {
        try {
            const { data } = await api.post("/auth/refresh");
            applyAuth(data);
        } catch {
            setToken(null);
            setAccessToken(null);
            setUser(null);
        }
    };

    const logout = async () => {
        await api.post("/auth/logout");
        setToken(null);
        setAccessToken(null);
        setUser(null);
    };

    useEffect(() => { void tryRefresh(); }, []);

    const value = useMemo(() => ({ user, token, login, register, logout, tryRefresh }), [user, token]);

    return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
    const v = useContext(Ctx);
    if (!v) throw new Error("useAuth must be used within AuthProvider");
    return v;
}
