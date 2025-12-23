import { Outlet } from "react-router-dom"
import Navbar from "../components/core/navbar"
import Footer from "../components/core/footer"

export const PublicLayout = () => {
    return (
        <>
            <Navbar />
            <Outlet />
            <Footer />
        </>
    )
}