import axiosInstance from "./api";
import { AuthEndpoints } from "../endpoints";
import type { RegisterFormValues } from "../../components/core/register-form";
import type { LoginFormValues } from "../../components/core/login-form";


const registerApi = function (data: RegisterFormValues) {
    return axiosInstance.post(AuthEndpoints.register, data)
}

const loginApi = function (data: LoginFormValues) {
    return axiosInstance.post(AuthEndpoints.login, data)
}

const verifyEmailApi = function (token: string) {
    return axiosInstance.post(AuthEndpoints.verifyEmail, { token })
}

const forgotPasswordApi = function (data: { email: string }) {
    return axiosInstance.post(AuthEndpoints.forgotPassword, data)
}

const resetPasswordApi = function (data: { password: string, confirmPassword: string, token: string }) {
    return axiosInstance.post(AuthEndpoints.resetPassword, data)
}

const getProfileApi = function () {

    return axiosInstance.get(AuthEndpoints.getProfile)
}

const logoutApi = function () {
    return axiosInstance.post(AuthEndpoints.logout)
}
export {
    registerApi,
    loginApi,
    verifyEmailApi,
    forgotPasswordApi,
    resetPasswordApi,
    getProfileApi,
    logoutApi
}
