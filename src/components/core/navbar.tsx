// Navbar.tsx
import { useRef, useState } from "react"
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai"
import { BsChevronDown } from "react-icons/bs"
import { Link } from "react-router-dom"

import logo from "../../assets/logo/logo-white.jpg"
import ProfileDropdown from "./profile-dropdown"
import { useQuery } from "@tanstack/react-query"
import { getAllCategories } from "../../service/api/categories.api"
import { useUserStore } from "../../store/user.store"

const NAVBAR_LINKS = [
    { title: "Home", path: "/" },
    { title: "Category", path: "/category" },
    { title: "About", path: "/about" },
    { title: "Contact", path: "/contact" },
]

export type Category = {
    id: string
    name: string
    description: string
}
function Navbar() {
    const [showCatalog, setShowCatalog] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const hideTimerRef = useRef<number | null>(null)
    const user = useUserStore((state) => state.user)
    const { data: categories } = useQuery({
        queryKey: ["categories"],
        queryFn: getAllCategories,
        // Always refetch on page load / mount
        staleTime: 60 * 60 * 1000, // 1 hour

        // Keep data in memory to avoid flicker
        gcTime: 60 * 60 * 1000,

        // Disable background / automatic refetches
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,

        // Prevent retry storms
        retry: false,
    })

    return (
        <div
            className={`flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 bg-richblack-800 transition-all duration-200`}
        >
            <div className="flex w-11/12 max-w-maxContent items-center justify-between">
                {/* Logo */}
                <Link to="/" className="cursor-pointer">
                    <img src={logo} alt="Logo" className="overflow-hidden h-12" />
                </Link>

                {/* Navigation links */}
                <nav className="hidden md:block">
                    <ul className="flex gap-x-6 text-richblack-25">
                        {NAVBAR_LINKS.map((link, index) => (
                            <li key={index}>
                                {link.title === "Category" ? (
                                    <div
                                        className={`group relative flex cursor-pointer items-center gap-1 text-richblack-25`}
                                        onMouseEnter={() => {
                                            if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
                                            setShowCatalog(true)
                                        }}
                                        onMouseLeave={() => {
                                            if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
                                            hideTimerRef.current = setTimeout(() => setShowCatalog(false), 200)
                                        }}
                                    >
                                        <p>{link.title}</p>
                                        <BsChevronDown />
                                        {/* Catalog dropdown */}
                                        {showCatalog && (
                                            <div className="capitalize delay-200 absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[2em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-100 lg:w-[300px]">
                                                <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5" />
                                                {categories?.length ? (
                                                    categories?.map((subLink, i) => (
                                                        <Link
                                                            key={i}
                                                            to={`/categories/${subLink.name
                                                                .split(" ")
                                                                .join("-")
                                                                .toLowerCase()}`}
                                                            className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                                                        >
                                                            <p>{subLink.name}</p>
                                                        </Link>
                                                    ))
                                                ) : (
                                                    <p className="text-center">No Category Found</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <Link to={link.path}>
                                        <p className="text-richblack-25">{link.title}</p>
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>


                <div className="hidden items-center gap-x-4 md:flex ">
                    {user === null && (
                        <Link to="/login">
                            <button className="cursor-pointer rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                                Log in
                            </button>
                        </Link>
                    )}
                    {user === null && (
                        <Link to="/register" >
                            <button className="cursor-pointer rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                                Sign up
                            </button>
                        </Link>
                    )}
                </div>
                {/* Right side – ONLY profile, static user */}
                {user !== null && <div className="hidden items-center gap-x-4 md:flex ">
                    <ProfileDropdown />
                </div>}

                {/* Mobile menu icon */}
                <button
                    className="mr-4 md:hidden cursor-pointer z-[1001]"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? (
                        <AiOutlineClose fontSize={24} fill="#AFB2BF" />
                    ) : (
                        <AiOutlineMenu fontSize={24} fill="#AFB2BF" />
                    )}
                </button>

                {/* Mobile Menu Overlay */}
                {isMenuOpen && (
                    <div
                        className="fixed inset-0 z-[1000] bg-richblack-900 bg-opacity-50 md:hidden"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <div
                            className="absolute right-0 top-0 h-full w-[250px] bg-richblack-800 p-6 shadow-2xl transition-all duration-300 transform translate-x-0"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex flex-col gap-y-6 mt-10">
                                {NAVBAR_LINKS.map((link, index) => (
                                    <li key={index} className="list-none">
                                        {link.title === "Category" ? (
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center justify-between text-richblack-25 border-b border-richblack-700 pb-2">
                                                    <p>{link.title}</p>
                                                </div>
                                                <div className="flex flex-col gap-2 pl-4">
                                                    {categories?.length ? (
                                                        categories?.map((subLink, i) => (
                                                            <Link
                                                                key={i}
                                                                to={`/categories/${subLink.name
                                                                    .split(" ")
                                                                    .join("-")
                                                                    .toLowerCase()}`}
                                                                onClick={() => setIsMenuOpen(false)}
                                                                className="text-richblack-100 hover:text-yellow-50"
                                                            >
                                                                {subLink.name}
                                                            </Link>
                                                        ))
                                                    ) : (
                                                        <p className="text-richblack-400 text-sm italic">No Category Found</p>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <Link
                                                to={link.path}
                                                onClick={() => setIsMenuOpen(false)}
                                                className="text-richblack-25 text-lg font-medium hover:text-yellow-50 active:text-yellow-50 border-b border-richblack-700 pb-2 block"
                                            >
                                                {link.title}
                                            </Link>
                                        )}
                                    </li>
                                ))}

                                <div className="mt-4 flex flex-col gap-y-4">
                                    {user === null ? (
                                        <>
                                            <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                                                <button className="w-full rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 text-center">
                                                    Log in
                                                </button>
                                            </Link>
                                            <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                                                <button className="w-full rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 text-center">
                                                    Sign up
                                                </button>
                                            </Link>
                                        </>
                                    ) : (
                                        <div className="flex flex-col gap-4">
                                            <p className="text-richblack-100">Welcome, {user.firstName}</p>
                                            <ProfileDropdown />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Navbar
