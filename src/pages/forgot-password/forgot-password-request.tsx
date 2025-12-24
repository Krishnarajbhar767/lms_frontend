
import { useForm } from "react-hook-form"
import { BiArrowBack } from "react-icons/bi"
import { Link } from "react-router-dom"
import Input from "../../components/core/input"
import Button from "../../components/core/button"
import { forgotPasswordApi } from "../../service/api/auth.api"
import toast from "react-hot-toast"

function ForgotPassword() {
    const { register, handleSubmit, formState: { errors, isSubmitting, isSubmitSuccessful, submitCount } } = useForm<{ email: string }>()
    const handleOnSubmit = handleSubmit(async (data) => {
        // const res = await forgotPasswordApi(data)
        // console.log(res)
        // if (res.data?.success) {
        //     toast.success(res.data.message)
        // }
        try {
            const res = await forgotPasswordApi(data)
            console.log(res)
            if (res.data?.success) {
                toast.success(res.data.message)
            }
        } catch (error: any) {
            toast.error(error.response.data.message)
        }
    })
    return (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
            <div className="max-w-[500px] p-4 lg:p-8">
                <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">
                    Reset your password
                </h1>
                <p className="my-4 text-[1.125rem] leading-[1.625rem] text-richblack-100">
                    Have no fear. We'll email you instructions to reset your password. If you dont have access to your email we can try account recovery
                </p>
                <form onSubmit={handleOnSubmit} key={submitCount}>
                    {!isSubmitSuccessful && (
                        <Input type="email" label="Email" name="email" placeholder="Enter your email" register={register} validation={{ required: 'Email is required' }}
                            error={errors} />
                    )}
                    <Button type="submit" disabled={isSubmitting || isSubmitSuccessful} className="w-full mt-4">{
                        // if isSubmitting is true then show "Sending..." else show "Send" or if isSubmitSuccessful is true then show "Sent"
                        isSubmitting ? "Sending..." : isSubmitSuccessful ? "Sent" : "Send"
                    }</Button>
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

export default ForgotPassword