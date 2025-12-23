import { useQuery } from "@tanstack/react-query"
import { getAllCourses } from "../../../service/api/course.api"
import { Skeleton } from "../../../components/core/skeleton"
import { useEffect, useState } from "react"
import type { Course } from "../../../service/api/course.api"
import AdminCoursesTable, { AdminCoursesTableSkeleton } from "./admin-courses-table"
import Button from "../../../components/core/button"
import { useNavigate } from "react-router-dom"
import { useCourseStore } from "../../../store/course.store"

const AdminCourses = () => {
    const [page, setPage] = useState(1)
    const [limit] = useState(10)
    const resetCourse = useCourseStore((state) => state.resetCourse)
    const navigate = useNavigate()
    const { data, isLoading } = useQuery({
        queryKey: ["courses", page, limit],
        queryFn: () => getAllCourses(page, limit),
        staleTime: 60 * 60 * 1000,
    })

    const [courses, setCourses] = useState<Course[]>([])
    const [pagination, setPagination] = useState<any>(null)

    useEffect(() => {
        if (data) {
            setCourses(data.courses)
            setPagination(data.pagination)
        }
    }, [data])

    if (isLoading) {
        return <AdminCoursesSkeleton />
    }

    const addNewCourseHandler = () => {
        navigate("/admin/add-course")
        // when go for new couse make sure to reset previous course data
        resetCourse()
    }
    return (
        <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">All Courses</h1>
                <Button onClick={addNewCourseHandler}>Add New Course</Button>
            </div>

            <AdminCoursesTable
                courses={courses}
                pagination={pagination}
                onPageChange={(newPage) => setPage(newPage)}
            />
        </div >
    )
}
export default AdminCourses

const AdminCoursesSkeleton = () => {
    return (
        <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <Skeleton className="h-8 w-48 bg-richblack-800" />
                <Skeleton className="h-10 w-32 bg-richblack-800 rounded-md" />
            </div>
            <AdminCoursesTableSkeleton />
        </div>
    )
}
