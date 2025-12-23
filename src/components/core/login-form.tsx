
import { useForm } from "react-hook-form";
import Button from "./button"
import Input from "./input"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { getProfileApi, loginApi } from "../../service/api/auth.api";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useUserStore } from "../../store/user.store";

export type LoginFormValues = {
    email: string;
    password: string;
}


function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>();

    const loginMutation = useMutation({
        mutationFn: loginApi,
        onSuccess: async (data) => {
            toast.success(data.data?.message);
            // set token in localStorage  
            localStorage.setItem("token", data.data?.data);
            const res = await getProfileApi()
            useUserStore.setState({ user: res.data?.data });
        },
        onError: (error: any) => {
            console.log(error)
            toast.error(error.response?.data?.message);
        }
    })
    const onSubmit = (data: LoginFormValues) => {
        loginMutation.mutate(data)
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-6 flex w-full flex-col gap-y-4"
        >
            <Input
                type="email"
                label="Email"
                name="email"
                placeholder="Enter your email"
                register={register}
                error={errors}
                validation={{
                    required: "Email is required",

                }}
            />
            <Input
                type={showPassword ? "text" : "password"}
                label="Password"
                name="password"
                register={register}
                placeholder="Enter your password"
                error={errors}
                validation={{
                    required: "Password is required",
                    minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters long"
                    }
                }}
            >
                <span onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                        <AiOutlineEyeInvisible fontSize={24} fill="#fff" />
                    ) : (
                        <AiOutlineEye fontSize={24} fill="#fff" />
                    )}
                </span>
            </Input>
            <div>
                <Link to="/forgot-password-request" className="w-full inline-block text-sm text-white font-medium underline text-right ">Forgot Password?</Link>
            </div>
            <Button type="submit" variant="primary" disabled={loginMutation.isPending}>
                {
                    loginMutation.isPending ? (
                        "Signing In..."
                    ) : (
                        "Sign In"
                    )
                }
            </Button>

        </form>
    )
}

export default LoginForm

