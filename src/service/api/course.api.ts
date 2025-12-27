import { CourseEndpoints } from "../endpoints"
import axiosInstance from "./api"
import type { ApiResponse } from "./api"

export interface PaginationData {
    totalCourses: number;
    totalPages: number;
    currentPage: number;
    limit: number;
}

export interface PaginatedCourses {
    courses: Course[];
    pagination: PaginationData;
}

export const uploadThumbnail = async (thumbnail: File, courseName: string, isEditing: boolean) => {
    // create formdata first
    const formData = new FormData()
    formData.append("courseName", courseName)
    formData.append("thumbnail", thumbnail)
    formData.append("isEditing", String(isEditing))
    // send thumnail data as req.files.thumbnail
    const res = await axiosInstance.post<ApiResponse<string>>(CourseEndpoints.uploadThumbnail, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
    return res?.data?.data
}

export interface Course {
    title: string;
    description: string;
    price: number;
    thumbnail: string;
    categoryId: number;
    language: string;
    status?: string
    createdAt?: string
    updatedAt?: string
    id?: number
    sections?: Section[]
    category?: {
        id: number;
        name: string;
    }
}

export interface Section {
    id: number;
    title: string;
    courseId: number;
    lessons: Lesson[];
    order: number;
}

export interface Resource {
    id: number;
    name: string;
    url: string;
    lessonId: number;
}

export interface Lesson {
    id: number;
    title: string;
    bunnyVideoId?: string;
    duration?: number;
    sectionId: number;
    resource?: Resource[]
    order: number;
}
export const createCourse = async (courseData: Course) => {
    const res = await axiosInstance.post<ApiResponse<Course>>(CourseEndpoints.createCourse, courseData)
    return res?.data?.data
}

// update course api 
export const updateCourse = async (courseData: Course) => {
    const res = await axiosInstance.put<ApiResponse<Course>>(CourseEndpoints.updateCourse(courseData.id!), courseData)
    return res?.data?.data
}

export const getAllCourses = async (page = 1, limit = 10) => {
    const res = await axiosInstance.get<ApiResponse<PaginatedCourses>>(CourseEndpoints.getAllCourses, {
        params: { page, limit }
    })
    return res?.data?.data
}

export const getStudentCourses = async (page = 1, limit = 10) => {
    const res = await axiosInstance.get<ApiResponse<PaginatedCourses>>(CourseEndpoints.getStudentCourses, {
        params: { page, limit }
    })
    return res?.data?.data
}

export const updateCourseStatus = async (id: number, status: "PUBLISHED" | "DRAFT") => {
    const res = await axiosInstance.post<ApiResponse<Course>>(CourseEndpoints.updateCourseStatus(id), { status })
    return res?.data?.data
}

export const archiveCourseApi = async (id: number) => {
    const res = await axiosInstance.delete<ApiResponse<Course>>(CourseEndpoints.archiveCourse(id))
    return res?.data
}

// make partial optioanl  only  order,sectionId,duration 
export const createLessonApi = async (lessonData: Omit<Lesson, "id" | "order" | "resource"> & { resource?: string }) => {
    const res = await axiosInstance.post<ApiResponse<Course>>(CourseEndpoints.createLesson, {
        title: lessonData.title,
        sectionId: lessonData.sectionId,
        bunnyVideoId: lessonData.bunnyVideoId,
        duration: lessonData.duration,
        resource: lessonData.resource,
    });
    return res?.data?.data
}

export const uploadResourceApi = async (file: File, onProgress?: (progress: number) => void) => {
    const formData = new FormData();
    formData.append("resource", file);

    const res = await axiosInstance.post<ApiResponse<{ resourceUrl: string }>>(CourseEndpoints.uploadResource, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
            if (onProgress && progressEvent.total) {
                const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                onProgress(progress);
            }
        },
    });

    return res?.data?.data
}

export const updateLessonApi = async (lessonId: number, lessonData: Partial<Omit<Lesson, "resource">> & { resource?: string }) => {
    const res = await axiosInstance.put<ApiResponse<Course>>(CourseEndpoints.updateLesson(lessonId), lessonData);
    return res?.data?.data
}

