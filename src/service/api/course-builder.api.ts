import { CourseEndpoints } from "../endpoints";
import axiosInstance from "./api"
import type { ApiResponse } from "./api";
import type { Course } from "./course.api";


// Section Interfaces
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

// Lesson Interfaces
export interface Lesson {
    id: number;
    title: string;
    bunnyVideoId?: string;
    duration?: number;
    sectionId: number;
    resource?: Resource[];
    order: number;
}

// API Functions

// Section APIs
export const createSection = async (title: string, courseId: number) => {
    const res = await axiosInstance.post<ApiResponse<Section>>("/sections/create", { title, courseId })
    return res?.data?.data
}

export const updateSection = async (sectionId: number, title: string) => {
    const res = await axiosInstance.put<ApiResponse<Section>>(`/sections/update/${sectionId}`, { title })
    return res?.data?.data
}

export const deleteSection = async (sectionId: number) => {
    const res = await axiosInstance.delete<ApiResponse<null>>(`/sections/delete/${sectionId}`)
    return res?.data?.data
}

export const reorderSections = async (courseId: number, sectionOrder: { id: number; order: number }[]) => {
    console.log("Under APIS")
    const res = await axiosInstance.put<ApiResponse<Section[]>>(`/sections/reorder/${courseId}`, { sectionOrder })
    return res?.data?.data
}

// Lesson APIs
export const createLesson = async (title: string, sectionId: number, bunnyVideoId?: string, duration?: number, resource?: string) => {
    const res = await axiosInstance.post<ApiResponse<Lesson>>("/lessons/create", { title, sectionId, bunnyVideoId, duration, resource })
    return res?.data?.data
}

export const uploadLessonResource = async (file: File) => {
    const formData = new FormData()
    formData.append("resource", file)
    const res = await axiosInstance.post<ApiResponse<{ resourceUrl: string }>>("/lessons/upload-resource", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
    return res?.data?.data
}

export const reorderLessonsApi = async (sectionId: number, lessonOrder: { id: number; order: number }[]) => {
    const res = await axiosInstance.put<ApiResponse<Lesson[]>>(`/lessons/reorder/${sectionId}`, { lessonOrder })
    return res?.data?.data
}


export const deleteLesson = async (lessonId: number) => {
    const res = await axiosInstance.delete<ApiResponse<null>>(`/lessons/${lessonId}`)
    return res?.data?.data
}

export const deleteResourceFileApi = async (resourceUrl: string) => {
    const res = await axiosInstance.delete<ApiResponse<null>>(CourseEndpoints.deleteResourceFile, { data: { resourceUrl } })
    return res?.data?.data
}

export const deleteResourceApi = async (resourceId: number) => {
    const res = await axiosInstance.delete<ApiResponse<Course>>(CourseEndpoints.deleteResource(resourceId))
    return res?.data?.data
}

