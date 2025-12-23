// ProfileDropDown.tsx
import { useRef, useState } from "react"
import { AiOutlineCaretDown } from "react-icons/ai"
import { VscDashboard, VscSignOut } from "react-icons/vsc"
import { Link } from "react-router-dom"
import { useOnClickOutside } from "../../hooks/use-on-click-outside"
import { getAvatar } from "../../utils/get-avtar"
import { useUserStore } from "../../store/user.store"
// Static mock user
export default function ProfileDropdown() {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement | null>(null)
    const user = useUserStore((state) => state.user)
    const { logout } = useUserStore((state) => state)
    useOnClickOutside(ref, () => setOpen(false))

    return (
        <button className="relative cursor-pointer" onClick={() => setOpen((prev) => !prev)}>
            <div className="flex items-center gap-x-1">
                <img
                    // src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${user.firstName}`}
                    src={getAvatar(user?.firstName as string, user?.lastName as string)}
                    alt={`profile-${user?.firstName}`}
                    className="aspect-square w-[30px] rounded-full object-cover"
                />
                <AiOutlineCaretDown className="text-sm text-richblack-100" />
            </div>

            {open && (
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-[118%] right-0 z-[1000] divide-y-[1px] divide-richblack-700 overflow-hidden rounded-md border-[1px] border-richblack-700 bg-richblack-800"
                    ref={ref}
                >
                    <Link to={user?.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard/my-profile'}
                        onClick={() => setOpen(false)}>
                        <div className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25">
                            <VscDashboard className="text-lg" />
                            Dashboard
                        </div>
                    </Link>

                    {/* Fake logout – just closes dropdown */}
                    <button
                        type="button"
                        onClick={() => {
                            localStorage.removeItem("token")
                            logout()
                        }}
                        className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-left text-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25"
                    >
                        <VscSignOut className="text-lg" />
                        Logout
                    </button>
                </div>
            )}
        </button>
    )
}
