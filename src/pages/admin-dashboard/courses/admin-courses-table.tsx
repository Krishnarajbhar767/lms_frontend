import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import type { ColDef } from "ag-grid-community";
import { archiveCourseApi, type Course, type PaginationData } from "../../../service/api/course.api";
import { useMemo, useState } from "react";
import { Skeleton } from "../../../components/core/skeleton";
import { FiEdit2 } from "react-icons/fi"
import { RiDeleteBin6Line } from "react-icons/ri"
import { useNavigate } from "react-router-dom";
import { useCourseStore } from "../../../store/course.store";
import { useStepsStore } from "../../../store/steps.store";
import { useMutation } from "@tanstack/react-query";
import ConfirmModal from "../../../components/core/confirm-modal";
import toast from "react-hot-toast";
import { queryClient } from "../../../main";

ModuleRegistry.registerModules([AllCommunityModule]);

interface AdminCoursesTableProps {
    courses: Course[];
    pagination: PaginationData | null;
    onPageChange: (page: number) => void;
}

const AdminCoursesTable = ({
    courses,
    pagination,
    onPageChange,
}: AdminCoursesTableProps) => {
    const navigate = useNavigate()
    const setCourse = useCourseStore((state) => state.setCourse)
    const setStep = useStepsStore((s) => s.setStep)
    const [confirmModalOpenId, setConfirmModalOpenId] = useState<number | null>(null)

    const courseEditHandler = (course: Course) => {
        console.log('EDITING TABLE', course)
        setStep(1)
        setCourse(course)
        navigate(`/admin/add-course`)
    }
    const archiveCourseHandler = (courseId: number) => {

        setConfirmModalOpenId(courseId)
    }
    const archiveCourseMutation = useMutation({
        mutationFn: (courseId: number) => archiveCourseApi(courseId),
        onSuccess: () => {
            toast.success("Course archived successfully")
            setConfirmModalOpenId(null)
            // invalidate course query
            queryClient.invalidateQueries({ queryKey: ["courses"] })
        }
    })
    const columnDefs = useMemo<ColDef<Course>[]>(() => [
        {
            headerName: "Title",
            field: "title",
            flex: 1,
            sortable: true,
            filter: true,
            cellClass: "text-richblack-5 font-medium flex items-center capitalize",
        },
        {
            headerName: "Category",
            width: 160,
            valueGetter: (p) => p.data?.category?.name || "N/A",
            cellClass: "text-richblack-25 flex items-center capitalize",
        },
        {
            headerName: "Price",
            field: "price",
            width: 120,
            sortable: true,
            valueFormatter: (p) => `₹${p.value}`,
            cellClass: "text-richblack-5 font-mono flex items-center",
        },
        {
            headerName: "Status",
            field: "status",
            width: 140,
            cellRenderer: (p: any) => {
                const map: Record<string, string> = {
                    PUBLISHED:
                        "bg-caribbeangreen-100 text-caribbeangreen-700 border-caribbeangreen-200",
                    DRAFT: "bg-yellow-100 text-yellow-700 border-yellow-200",
                    ARCHIVED: "bg-pink-100 text-pink-700 border-pink-200",
                };

                return (
                    <div className="flex items-center h-full">
                        <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${map[p.value] || "bg-richblack-700 text-richblack-100 border-richblack-600"
                                }`}
                        >
                            {p.value}
                        </span>
                    </div>
                );
            },
        },
        {
            headerName: "Created At",
            field: "createdAt",
            width: 160,
            cellClass: "text-richblack-25 flex items-center",
            // Render Value  as dd/mm/yyyy 30/12/2025
            cellRenderer: (p: any) => new Date(p.value).toLocaleDateString("en-GB"),
        },
        {
            headerName: "Actions",
            width: 200,
            cellRenderer: (params: any) => (
                <div className="flex justify-start items-center gap-x-2 h-full">
                    <button
                        title="Edit"
                        onClick={() => courseEditHandler(params.data)}
                        className="cursor-pointer p-2 transition-all duration-200 hover:scale-110 hover:text-caribbeangreen-300 text-richblack-100"
                    >
                        <FiEdit2 size={20} />
                    </button>
                    <button
                        title="Delete"
                        onClick={() => archiveCourseHandler(params.data.id)}
                        // desable this  button if course statu is already archived
                        disabled={archiveCourseMutation.isPending || params.data.status === "ARCHIVED"}
                        className="cursor-pointer p-2 transition-all duration-200 hover:scale-110 hover:text-[#ff0000] text-richblack-100"
                    >
                        <RiDeleteBin6Line size={20} />
                    </button>
                </div>
            ),
        },
    ], []);

    const defaultColDef = useMemo<ColDef>(
        () => ({
            resizable: true,
            suppressMovable: true,
            sortable: true,
        }),
        []
    );

    return (
        <div className="w-full flex flex-col gap-4">
            <div
                className="ag-theme-custom-dark bg-richblack-800 border border-richblack-700 rounded-xl shadow-2xl overflow-hidden"
                style={{ height: 520 }}
            >
                <AgGridReact
                    rowData={courses}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    pagination={false}
                    suppressCellFocus
                    suppressRowClickSelection
                    rowSelection="single"
                    headerHeight={48}
                    rowHeight={56}


                />
            </div>
            {
                confirmModalOpenId && (
                    <ConfirmModal
                        isOpen={!!confirmModalOpenId}
                        title="Are you sure?"
                        description="This action will make your course ARCHIVED. Students will not be able to access this course."
                        confirmText="Confirm"
                        cancelText="Cancel"
                        variant="danger"
                        loading={archiveCourseMutation.isPending}
                        onConfirm={() => archiveCourseMutation.mutate(confirmModalOpenId)}
                        onCancel={() => setConfirmModalOpenId(null)}
                    />
                )
            }
            {pagination && (
                <div className="flex items-center justify-between px-6 py-4 bg-richblack-800 border border-richblack-700 rounded-xl">
                    <p className="text-sm text-richblack-300">
                        Showing page{" "}
                        <span className="text-richblack-5 font-medium">
                            {pagination.currentPage}
                        </span>{" "}
                        of{" "}
                        <span className="text-richblack-5 font-medium">
                            {pagination.totalPages}
                        </span>{" "}
                        (
                        <span className="text-richblack-5 font-medium">
                            {pagination.totalCourses}
                        </span>{" "}
                        courses)
                    </p>

                    <div className="flex gap-2">
                        <button
                            disabled={pagination.currentPage === 1}
                            onClick={() => onPageChange(pagination.currentPage - 1)}
                            className="px-3 py-1.5 rounded-md border border-richblack-700 bg-richblack-800 text-sm font-medium text-richblack-100 transition-all hover:bg-richblack-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>

                        {[...Array(pagination.totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => onPageChange(i + 1)}
                                className={`px-3 py-1.5 rounded-md border text-sm font-medium transition-all ${pagination.currentPage === i + 1
                                    ? "bg-yellow-50 border-yellow-50 text-richblack-900 font-bold"
                                    : "bg-richblack-800 border-richblack-700 text-richblack-100 hover:bg-richblack-700"
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            disabled={pagination.currentPage === pagination.totalPages}
                            onClick={() => onPageChange(pagination.currentPage + 1)}
                            className="px-3 py-1.5 rounded-md border border-richblack-700 bg-richblack-800 text-sm font-medium text-richblack-100 transition-all hover:bg-richblack-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export const AdminCoursesTableSkeleton = () => {
    return (
        <div className="w-full flex flex-col gap-4 animate-pulse">
            <div className="bg-richblack-800 rounded-xl overflow-hidden border border-richblack-700 shadow-2xl">
                {/* Header Skeleton */}
                <div className="bg-richblack-700 h-12 flex items-center px-4 gap-4">
                    <Skeleton className="h-4 flex-1 bg-richblack-600" />
                    <Skeleton className="h-4 w-32 bg-richblack-600" />
                    <Skeleton className="h-4 w-24 bg-richblack-600" />
                    <Skeleton className="h-4 w-28 bg-richblack-600" />
                    <Skeleton className="h-4 w-32 bg-richblack-600" />
                </div>
                {/* Row Skeletons */}
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 flex items-center px-4 gap-4 border-b border-richblack-700">
                        <Skeleton className="h-4 flex-1 bg-richblack-700" />
                        <Skeleton className="h-4 w-32 bg-richblack-700" />
                        <Skeleton className="h-4 w-24 bg-richblack-700" />
                        <Skeleton className="h-4 w-28 bg-richblack-700" />
                        <Skeleton className="h-4 w-32 bg-richblack-700" />
                    </div>
                ))}
            </div>
            {/* Footer Skeleton */}
            <div className="h-16 bg-richblack-800 border border-richblack-700 rounded-xl flex items-center justify-between px-6">
                <Skeleton className="h-4 w-48 bg-richblack-700" />
                <Skeleton className="h-10 w-64 rounded-md bg-richblack-700" />
            </div>
        </div>
    );
};

export default AdminCoursesTable;
