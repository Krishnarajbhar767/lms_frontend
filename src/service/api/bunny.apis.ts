import axios from "axios";
import axiosInstance from "./api";

// src/api/bunny.ts
export async function apiGetBunnyConfig() {
    const res = await axiosInstance.get("/bunny/config");
    return res.data?.data as { libraryId: string };
}

export async function apiCreateBunnyVideo(title: string) {
    const res = await axiosInstance.post("/bunny/create", { title });
    console.log('Response of create bunny video', res)
    return res.data?.data as {
        videoId: string;
        uploadUrl: string;
        libraryId: string;
        accessKey: string;
    };
}

export async function apiUploadToBunny(file: File, uploadUrl: string, accessKey: string, onProgress?: (progress: number) => void) {
    try {
        const res = await axios.put(uploadUrl, file, {
            headers: {
                "Content-Type": "application/octet-stream",
                AccessKey: accessKey,
            },
            onUploadProgress: (progressEvent) => {
                if (onProgress && progressEvent.total) {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onProgress(progress);
                }
            },
        });
        console.log("Upload response:", res.status, res.statusText);
        return res;
    } catch (error: any) {
        console.error("Bunny Upload Error:", error.response?.data || error.message);
        throw error;
    }
}

export async function getEmbedUrl(videoId: string) {
    const res = await axiosInstance.get(`/bunny/get-embed-url/${videoId}`);
    return res.data?.data as { embedUrl: string };
}

export async function deleteBunnyVideoApi(videoId: string) {
    try {
        const res = await axiosInstance.delete(`/bunny/${videoId}`)
        console.log("Delete response:", res.status, res.statusText);
        return res;
    } catch (error: any) {
        console.error("Bunny Delete Error:", error.response?.data || error.message);
        throw error;
    }
}
