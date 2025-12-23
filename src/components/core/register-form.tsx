import { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import Button from "./button";
import Input from "./input";
import { registerApi } from "../../service/api/auth.api";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";


export type RegisterFormValues = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}
function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate();
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormValues>();
    const registerMutation = useMutation({
        mutationFn: registerApi,
        onSuccess: () => {
            toast.success("Regitration successfull! Please verify your account.");
            navigate("/login");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message);
        }
    })
    const onSubmit = (data: RegisterFormValues) => {
        registerMutation.mutate(data)
    }
    return (
        <div>
            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-y-4">
                <div className="flex gap-x-4">
                    <Input
                        type="text"
                        label="First Name"
                        name="firstName"
                        placeholder="Enter your first name"
                        register={register}
                        error={errors}
                        validation={{ required: "First name is required" }}
                    />
                    <Input
                        type="text"
                        label="Last Name"
                        name="lastName"
                        placeholder="Enter your last name"
                        register={register}
                        error={errors}
                        validation={{ required: "Last name is required" }}
                    />

                </div>

                <div className="flex gap-x-4">
                    <Input
                        type="email"
                        label="Email"
                        name="email"
                        placeholder="Enter your email"
                        register={register}
                        error={errors}
                        validation={{ required: "Email is required" }}
                    />
                </div>

                <div className="flex gap-x-4">
                    <Input
                        type={showPassword ? "text" : "password"}
                        label="Password"
                        name="password"
                        placeholder="Enter your password"
                        register={register}
                        error={errors}
                        validation={{ required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters long" } }}
                    >
                        <span onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? (
                                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                            ) : (
                                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                            )}
                        </span>
                    </Input>
                    <Input
                        type={showConfirmPassword ? "text" : "password"}
                        label="Confirm Password"
                        name="confirmPassword"
                        placeholder="Enter your confirm password"
                        register={register}
                        error={errors}
                        validation={{ required: "Confirm Password is required", validate: (value: string) => value === watch("password") || "Passwords do not match", minLength: { value: 6, message: "Password must be at least 6 characters long" } }}
                    > <span onClick={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? (
                        <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                    ) : (
                        <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                    )}</span></Input>
                </div>
                <Button type="submit" variant="primary" disabled={registerMutation.isPending}>
                    {
                        registerMutation.isPending ? (
                            "Registering..."
                        ) : (
                            "Register"
                        )
                    }
                </Button>
            </form>
        </div>
    )
}

export default RegisterForm