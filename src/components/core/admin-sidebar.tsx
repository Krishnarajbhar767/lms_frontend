
import {
    VscDashboard,
    VscBook,
    VscAdd,
    VscSettingsGear,
} from "react-icons/vsc"
import { VscSignOut } from "react-icons/vsc"

import { NavLink } from "react-router-dom"
import ConfirmModal from "./confirm-modal"
import { useState } from "react"
import { useUserStore } from "../../store/user.store"
import toast from "react-hot-toast"

export const ADMIN_LINKS = [
    {
        name: "Dashboard",
        path: "/admin/dashboard",
        icon: VscDashboard,
    },
    {
        name: "Courses",
        path: "/admin/courses",
        icon: VscBook,
    },
    {
        name: "Add",
        path: "/admin/add-course",
        icon: VscAdd,
    },
    {
        name: "Settings",
        path: "/admin/settings",
        icon: VscSettingsGear,
    },
]

type SidebarLinkProps = {
    name: string
    path: string
    icon: React.ComponentType<{ className?: string }>
}



export default function AdminSidebar() {
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
    const logout = useUserStore((state) => state.logout)
    const logoutHandler = () => {
        logout()
        setIsConfirmModalOpen(false)
        toast.success('Logout successfully')
    }
    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex h-screen min-w-[220px] flex-col border-r border-r-richblack-700 bg-richblack-800 py-10">
                <div className="flex flex-col">
                    {ADMIN_LINKS.map((link) => (
                        <SidebarLink key={link.path} {...link} />
                    ))}
                </div>

                <div className="mx-auto my-6 h-[1px] w-10/12 bg-richblack-700" />

                <button
                    className="px-8 py-2 text-sm font-medium text-richblack-300 hover:text-red-400 transition-colors"
                    onClick={() => setIsConfirmModalOpen(true)}
                >
                    <div className="flex items-center gap-x-2" >
                        <VscSignOut className="text-lg" />
                        <span>Logout</span>
                    </div>
                </button>
            </aside>

            {/* Mobile Bottom Bar */}
            <MobileBottomNav />
            {
                isConfirmModalOpen &&
                <ConfirmModal
                    isOpen={isConfirmModalOpen}
                    onCancel={() => setIsConfirmModalOpen(false)}
                    title="Are you sure?"
                    description="You will be logged out."
                    cancelText="Cancel"
                    confirmText="Logout"
                    variant='danger'
                    onConfirm={logoutHandler}
                />
            }
        </>
    )
}

export function SidebarLink({ name, path, icon: Icon }: SidebarLinkProps) {
    return (
        <NavLink
            to={path}
            className={({ isActive }) =>
                `relative px-8 py-2 text-sm font-medium transition-all duration-200
        ${isActive
                    ? "bg-yellow-800 text-yellow-50"
                    : "text-richblack-300 hover:bg-richblack-700"
                }`
            }
        >
            {({ isActive }) => (
                <>
                    <span
                        className={`absolute left-0 top-0 h-full w-[0.15rem] bg-yellow-50 ${isActive ? "opacity-100" : "opacity-0"
                            }`}
                    />

                    <div className="flex items-center gap-x-2">
                        <Icon className="text-lg" />
                        <span>{name}</span>
                    </div>
                </>
            )}
        </NavLink>
    )
}

export function MobileBottomNav() {
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
    const logout = useUserStore((state) => state.logout)
    const logoutHandler = () => {
        logout()
        setIsConfirmModalOpen(false)
        toast.success('Logout successfully')
    }
    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden bg-richblack-800 border-t border-richblack-700">
            {ADMIN_LINKS.map(({ name, path, icon: Icon }) => (
                <NavLink
                    key={path}
                    to={path}
                    className={({ isActive }) =>
                        `flex flex-1 flex-col items-center justify-center py-2 text-xs transition-colors
            ${isActive
                            ? "text-yellow-50"
                            : "text-richblack-300 hover:text-white"
                        }`
                    }
                >
                    <Icon className="text-lg" />
                    <span className="mt-1">{name}</span>
                </NavLink>
            ))}

            {/* Logout */}
            <button
                onClick={() => setIsConfirmModalOpen(true)}
                className="flex flex-1 flex-col items-center justify-center py-2 text-xs text-red-400 hover:text-red-300"
            >
                <VscSignOut className="text-lg" />
                <span className="mt-1">Logout</span>
            </button>
            {
                isConfirmModalOpen &&
                <ConfirmModal
                    isOpen={isConfirmModalOpen}
                    onCancel={() => setIsConfirmModalOpen(false)}
                    title="Are you sure?"
                    description="You will be logged out."
                    cancelText="Cancel"
                    confirmText="Logout"
                    variant='danger'
                    onConfirm={logoutHandler}
                />
            }
        </nav>
    )
}
