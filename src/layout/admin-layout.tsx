
import { Outlet, useNavigate } from "react-router-dom";
import AdminSidebar from "../components/core/admin-sidebar";
import { useUserStore } from "../store/user.store";
import { Loader } from "../components/core/loader";



export const AdminLayout = () => {
    const user = useUserStore((state) => state?.user);
    const isUserLoading = useUserStore((state) => state.isUserloading)

    const navigate = useNavigate()

    if (isUserLoading) {
        return <Loader />;
    }
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