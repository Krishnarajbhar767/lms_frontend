import type { Category } from "../../components/core/navbar"
import { CategoryEndpoints } from "../endpoints"
import axiosInstance, { type ApiResponse } from "./api"

export const getAllCategories = async function (): Promise<Category[]> {
    const response = await axiosInstance.get<ApiResponse<Category[]>>(CategoryEndpoints.getAllCategories)
    return response?.data?.data
}   