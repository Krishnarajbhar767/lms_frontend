

const BASE = import.meta.env.VITE_API_BASE_URL

export const AuthEndpoints = {
    login: `${BASE}/auth/login`,
    register: `${BASE}/auth/register`,
    verifyEmail: `${BASE}/auth/verify-email`,
    logout: `${BASE}/auth/logout`,
    profile: `${BASE}/auth/profle`,
    refresh: `${BASE}/auth/refresh-tokens`,
    forgotPassword: `${BASE}/auth/forgot-password-request`,
    resetPassword: `${BASE}/auth/forgot-password-reset`,
    getProfile: `${BASE}/auth/get-profile`,
}

export const CategoryEndpoints = {
    getAllCategories: `${BASE}/categories/all`,
    getAdminCategories: `${BASE}/categories/admin-all`,
    createCategory: `${BASE}/categories`,
    updateCategory: (id: number) => `${BASE}/categories/${id}`,
    deleteCategory: (id: number) => `${BASE}/categories/${id}`,
}

export const CourseEndpoints = {
    uploadThumbnail: `${BASE}/courses/upload-thumbnail`,
    createCourse: `${BASE}/courses/create`,
    updateCourse: (id: number) => `${BASE}/courses/update/${id}`,
    getAllCourses: `${BASE}/courses/admin`,
    getStudentCourses: `${BASE}/courses`,
    updateCourseStatus: (id: number) => `${BASE}/courses/update-status/${id}`,
    archiveCourse: (id: number) => `${BASE}/courses/archive/${id}`,
    createLesson: `${BASE}/lessons/create`,
    updateLesson: (id: number) => `${BASE}/lessons/update/${id}`,
    uploadResource: `${BASE}/lessons/upload-resource`,
    deleteResource: (id: number) => `${BASE}/lessons/resource/${id}`,
    deleteResourceFile: `${BASE}/lessons/resource/file`,
}
