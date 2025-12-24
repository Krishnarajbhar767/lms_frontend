import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { logoutApi } from "../service/api/auth.api";


interface UserStore {
    user: {
        id: string;
        name: string;
        email: string;
        role: 'ADMIN' | 'STUDENT';
        firstName: string;
        lastName: string;
        createdAt: string;
        updatedAt: string;
    } | null;
    isUserloading: boolean;
    setUser: (user: any) => void;
    logout: () => void;
    setIsUserloading: (isUserloading: boolean) => void;
}

export const useUserStore = create<UserStore>()(
    devtools(
        (set) => ({
            user: null,
            isUserloading: false,
            setUser: (user) => set({ user }),
            logout: async () => {
                localStorage.removeItem("token");
                await logoutApi();
                set({ user: null });
            },
            setIsUserloading: (isUserloading) => set({ isUserloading }),
        }),
        { name: "UserStore", enabled: true }
    )
);