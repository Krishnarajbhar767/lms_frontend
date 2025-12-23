import { createContext, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { getProfileApi } from "../../service/api/auth.api";
import { useUserStore } from "../../store/user.store";

type AuthContextType = {
    isAuthenticated: boolean;
    isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const token = localStorage.getItem("token");
    const user = useUserStore((s) => s.user);
    const setUser = useUserStore((s) => s.setUser);
    const {
        data,
        isLoading,
    } = useQuery({
        queryKey: ["profile"],
        queryFn: getProfileApi,
        enabled: !!token,
        retry: false,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: true,
    });
    // sync user with zustand
    useEffect(() => {
        if (data?.data?.data) {
            setUser(data.data.data);
        }
    }, [data, setUser]);
    return (
        <AuthContext.Provider
            value={{
                isAuthenticated: !!user,
                isLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
