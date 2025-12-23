// src/components/admin/CreateLessonForm.tsx
import { useState } from "react";
import { apiCreateBunnyVideo, apiUploadToBunny } from '../service/api/bunny.apis';

export default function CreateLessonForm({ sectionId }: { sectionId: number }) {
    const [title, setTitle] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<string>("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !title) return;

        try {
            setStatus("1/3 Creating Bunny video slot...");
            const { videoId, uploadUrl, libraryId, accessKey } = await apiCreateBunnyVideo(title);

            setStatus("2/3 Uploading file to Bunny...");
            await apiUploadToBunny(file, uploadUrl, accessKey);

            // Bunny player URL format (simple version)
            const videoUrl = `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}`;
            console.log('Video URL', videoUrl)
            setStatus("3/3 Saving lesson in database...");
            const res = await fetch("http://localhost:6572/api/lessons/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    sectionId,
                    bunnyVideoId: videoId,
                    videoUrl,
                    duration: 0, // you can update later
                }),
            });

            if (!res.ok) throw new Error("Failed to save lesson");

            setStatus("✅ Lesson created successfully!");
        } catch (err: any) {
            console.error(err);
            setStatus("❌ Error: " + err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded" >
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)
                }
                placeholder="Lesson title"
                className="border px-3 py-2 rounded w-full"
            />

            <input
                type="file"
                accept="video/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full"
            />

            <button
                type="submit"
                disabled={!file || !title}
                className="px-4 py-2 bg-blue-600 text-white rounded"
            >
                Create Lesson + Upload
            </button>

            {status && <p>{status} </p>}
        </form>
    );
}
