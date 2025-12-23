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
    setUser: (user: any) => void;
    logout: () => void;
}

export const useUserStore = create<UserStore>()(
    devtools(
        (set) => ({
            user: null,
            setUser: (user) => set({ user }),
            logout: async () => {
                localStorage.removeItem("token");
                await logoutApi();
                set({ user: null });
            },
        }),
        { name: "UserStore", enabled: true }
    )
);