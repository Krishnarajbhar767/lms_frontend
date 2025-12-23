import { useState } from "react"
import { useForm } from "react-hook-form"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { BiArrowBack } from "react-icons/bi"

import { Link, useNavigate, useSearchParams } from "react-router-dom"
import Input from "../../components/core/input"
import Button from "../../components/core/button"
import toast from "react-hot-toast"
import { resetPasswordApi } from "../../service/api/auth.api"

type ForgotPasswordFormValues = {
    password: string
    confirmPassword: string
}
function UpdatePassword() {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [searchParams] = useSearchParams();
    const navigate = useNavigate()
    const token = searchParams.get("token") as string;
    const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<ForgotPasswordFormValues>()
    const resetPasswordHandler = handleSubmit(async (data) => {
        try {
            const response = await resetPasswordApi({ ...data, token })
            toast.success(response.data.message)
            navigate("/login")
        } catch (error: any) {
            toast.error(error.response.data.message)
            navigate('/forgot-password-request')
        }
    })

    return (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">

            <div className="max-w-[500px] p-4 lg:p-8">
                <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">
                    Choose new password
                </h1>
                <p className="my-4 text-[1.125rem] leading-[1.625rem] text-richblack-100">
                    Almost done. Enter your new password and youre all set.
                </p>
                <form onSubmit={resetPasswordHandler} className="space-y-4">
                    {/* New Password */}
                    <Input type={showPassword ? "text" : "password"} name="password" label="New Password" placeholder="Enter your new password" register={register} validation={{ required: 'New Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } }} error={errors} >
                        <span onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? (
                                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                            ) : (
                                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                            )}
                        </span>
                    </Input>
                    {/* Confirm Password */}
                    <Input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" label="Confirm Password" placeholder="Enter your confirm password" register={register} validation={{ required: 'Confirm Password is required', validate: (value: string) => value === watch('password') || 'Passwords do not match' }} error={errors} >
                        <span onClick={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? (
                            <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                        ) : (
                            <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                        )}</span>

                    </Input>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        variant="primary"
                        className="w-full"
                    >
                        {isSubmitting ? 'Resetting...' : 'Reset Password'}
                    </Button>
                </form>
                <div className="mt-6 flex items-center justify-between">
                    <Link to="/login">
                        <p className="flex items-center gap-x-2 text-richblack-5">
                            <BiArrowBack /> Back To Login
                        </p>
                    </Link>
                </div>
            </div>

        </div>
    )
}

export default UpdatePassword