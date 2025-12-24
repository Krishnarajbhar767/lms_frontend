
import frameImg from "../../assets/images/frame.png"
import RegisterForm from "./register-form";
import LoginForm from "./login-form";
import { useUserStore } from "../../store/user.store";
import { useNavigate } from "react-router-dom";
import { Loader } from "./loader";
import { useEffect } from "react";
type Props = {
    title: string;
    description1: string;
    description2: string;
    image: string;
    formType: "login" | "signup";
}
function AuthForm({ title, description1, description2, image, formType }: Props) {
    const user = useUserStore((state) => state.user)
    const navigate = useNavigate()
    const isUserLoading = useUserStore((state) => state.isUserloading)
    useEffect(() => {
        if (user?.role === 'ADMIN') {
            navigate("/admin/dashboard")
        }
        if (user?.role === 'STUDENT') {
            navigate("/dashboard/my-profile")
        }
    }, [user])
    if (isUserLoading) {
        return <Loader />
    }
    return (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
            <div className="mx-auto flex w-11/12 max-w-maxContent flex-col-reverse justify-between gap-y-12 py-12 md:flex-row md:gap-y-0 md:gap-x-12">
                <div className="mx-auto w-11/12 max-w-[450px] md:mx-0">
                    <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5 capitalize">
                        {title}
                    </h1>
                    <p className="my-4 text-[1.125rem] leading-[1.625rem] ">
                        <span className="text-richblack-100">{description1}</span>{" "}
                        <span className="font-edu-sa font-bold italic text-blue-100">
                            {description2}
                        </span>
                    </p>
                    {formType === "signup" ? <RegisterForm /> : <LoginForm />}
                </div>
                <div className="relative mx-auto w-11/12 max-w-[450px] md:mx-0">
                    <img
                        src={frameImg}
                        alt="Pattern"
                        width={558}
                        height={504}
                        loading="lazy"
                    />
                    <img
                        src={image}
                        alt="Students"
                        width={558}
                        height={504}
                        loading="lazy"
                        className="absolute -top-4 right-4 z-10"
                    />
                </div>
            </div>
        </div>
    )
}

export default AuthForm