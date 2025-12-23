import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyEmailApi } from "../../service/api/auth.api";

import toast from "react-hot-toast";

import { useEffect } from "react";
import { CiCircleCheck } from "react-icons/ci";


function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token") as string;
    const navigate = useNavigate()
    let data: any;
    const verifyEmailHandler = async () => {
        if (!token) {
            navigate("/register");
        }
        try {
            data = await verifyEmailApi(token)
            toast.success(data.data.message);
            navigate("/login");
        } catch (error: any) {
            toast.error(error.response.data.message);
            navigate("/");
        }

    }

    useEffect(() => {
        if (token) {
            verifyEmailHandler();
        }
    }, [token])
    return <div className="flex h-screen items-center justify-center">
        {
            data ? (
                <h1 className="text-2xl font-bold text-green-500 flex items-center gap-x-2"><CiCircleCheck size={24} /> {data.data.message}</h1>
            ) : (
                <h1 className="text-2xl font-bold text-white">Verifying Email...</h1>
            )
        }
    </div>
}
export default VerifyEmail



