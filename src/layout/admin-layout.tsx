
import { Outlet, useNavigate } from "react-router-dom";
import AdminSidebar from "../components/core/admin-sidebar";
import { useUserStore } from "../store/user.store";



export const AdminLayout = () => {
    const user = useUserStore((state) => state?.user);
    const navigate = useNavigate()
    if (!user || user.role !== "ADMIN") {
        navigate("/", { replace: true })
        return
    }
    return (
        <div className="flex h-screen bg-richblack-900 overflow-hidden">
            <AdminSidebar />
            <div className="flex flex-col flex-1">
                {/* <Navbar /> */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};