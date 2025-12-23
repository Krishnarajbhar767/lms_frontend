import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { useCourseStore } from "../../../store/course.store"
import { updateCourseStatus } from "../../../service/api/course.api"
import Button from "../../../components/core/button"
import toast from "react-hot-toast"
import { useStepsStore } from "../../../store/steps.store"
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaRegSave } from "react-icons/fa";
import { queryClient } from "../../../main"



export const PublishCourse = () => {
    const { register, handleSubmit, setValue, getValues, watch } = useForm()
    const course = useCourseStore((state) => state.course)
    console.log('Course ', course)
    const setCourse = useCourseStore((state) => state.setCourse)
    const { prevStep } = useStepsStore()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const isPublic = watch("public")

    useEffect(() => {
        if (course?.status === "PUBLISHED") {
            setValue("public", true)
        }
    }, [course, setValue])

    const { mutate: updateCourseStatusMutation } = useMutation({
        mutationFn: (data: { id: number, status: "PUBLISHED" | "DRAFT" }) => updateCourseStatus(data.id, data.status),
        onSuccess: (data) => {
            setCourse(data)
            const message = data?.status === "PUBLISHED" ? "Course published successfully" : "Course draft successfully"
            toast.success(message)
            // invalidate course query 
            queryClient.invalidateQueries({
                queryKey: ["courses"],
            })
            navigate("/admin/courses")
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to publish course")
        }
    })

    const goBack = () => {
        prevStep()
    }

    const onSubmit = async () => {
        const formValues = getValues()
        const status = formValues.public ? "PUBLISHED" : "DRAFT"

        if (course?.status === status && !isUnchanged) {
            navigate("/admin/courses")
            return
        }

        setLoading(true)
        updateCourseStatusMutation({ id: course?.id!, status })
        setLoading(false)
    }

    const isUnchanged = (course?.status === "PUBLISHED" && isPublic === true) ||
        (course?.status === "DRAFT" && (isPublic === false || isPublic === undefined))

    return (
        <div className="rounded-md border border-richblack-700 bg-[#161d29] p-6">
            <p className="text-2xl font-semibold text-richblack-5">
                Publish Settings
            </p>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="my-6 mb-8">
                    <label htmlFor="public" className="inline-flex items-center text-lg">
                        <input
                            type="checkbox"
                            id="public"
                            {...register("public")}
                            className="border-gray-300 h-4 w-4 rounded bg-richblack-500 text-richblack-700 focus:ring-2 focus:ring-richblack-5"
                        />
                        <span className="ml-2 text-richblack-400">
                            Make this course as public
                        </span>
                    </label>
                </div>

                <div className="ml-auto flex max-w-max items-center gap-x-4">
                    <Button
                        disabled={loading}
                        type="button"
                        onClick={goBack}
                        variant="secondary"
                        className="flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900"
                    >
                        <IoMdArrowRoundBack /> Back
                    </Button>
                    <Button
                        disabled={loading || isUnchanged}
                        type="submit"
                        className="flex items-center gap-x-2 rounded-md bg-yellow-50 py-[8px] px-[20px] font-semibold text-richblack-900 focus:none disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Save Changes <FaRegSave />
                    </Button>
                </div>
            </form>
        </div>
    )
}
