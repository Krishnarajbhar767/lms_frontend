import axiosInstance from "./api";
import { CategoryEndpoints } from "../endpoints";

export interface Category {
    id: number;
    name: string;
    description: string;
    _count?: {
        courses: number;
    }
}

export const getAllCategoriesApi = async (isAdmin = false): Promise<Category[]> => {
    try {
        const endpoint = isAdmin ? CategoryEndpoints.getAdminCategories : CategoryEndpoints.getAllCategories;
        const response = await axiosInstance.get(endpoint);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
};

export const createCategoryApi = async (data: { name: string; description: string }) => {
    try {
        const response = await axiosInstance.post(CategoryEndpoints.createCategory, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateCategoryApi = async (id: number, data: { name: string; description: string }) => {
    try {
        const response = await axiosInstance.put(CategoryEndpoints.updateCategory(id), data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteCategoryApi = async (id: number, targetCategoryId?: number) => {
    try {
        const response = await axiosInstance.delete(CategoryEndpoints.deleteCategory(id), {
            data: { targetCategoryId }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
