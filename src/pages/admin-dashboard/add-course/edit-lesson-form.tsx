import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import Input from "../../../components/core/input";
import Button from "../../../components/core/button";
import UploadVideo from "../../../components/core/upload-video";
import UploadResource from "../../../components/core/upload-resource";
import { apiCreateBunnyVideo, apiUploadToBunny, deleteBunnyVideoApi } from "../../../service/api/bunny.apis";
import { updateLessonApi, uploadResourceApi } from "../../../service/api/course.api";
import { useCourseStore } from "../../../store/course.store";
import { deleteResourceApi, deleteResourceFileApi, type Lesson } from "../../../service/api/course-builder.api";
import { queryClient } from "../../../main";
import ConfirmModal from "../../../components/core/confirm-modal";
import BunnyPlayer from "../../../components/core/bunny-player";

interface EditLessonFormProps {
    lesson: Lesson;
    onCancel: () => void;
    onSuccess: () => void;
}

interface EditLessonFormValues {
    title: string;
    videoFile?: File;
    duration: number;
    resourceFile?: File;
}

export const EditLessonForm: React.FC<EditLessonFormProps> = ({ lesson, onCancel, onSuccess }) => {
    const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting, submitCount } } = useForm<EditLessonFormValues>({
        defaultValues: {
            title: lesson.title,
            duration: lesson.duration || 0,
        }
    });

    const videoFile = watch("videoFile");
    const duration = watch("duration");
    const hasVideo = lesson.bunnyVideoId || (videoFile && videoFile.size > 0);
    const setCourse = useCourseStore((state) => state?.setCourse);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isDeletingResource, setIsDeletingResource] = useState(false);
    const [showVideoPreview, setShowVideoPreview] = useState(false);

    const onSubmit = async (data: EditLessonFormValues) => {
        let newVideoId = "";
        let newResourceUrl = "";
        const isVideoChanged = data.videoFile && data.videoFile.size > 0;
        const isResourceChanged = data.resourceFile && data.resourceFile.size > 0;

        // Optimized: If nothing changed, just close
        if (!isVideoChanged && !isResourceChanged && data.title === lesson.title && data.duration === lesson.duration) {
            onCancel();
            return;
        }

        try {
            // --- Step 1: Upload NEW assets first ---

            // Handle New Video Upload
            if (isVideoChanged) {
                const createVideoRes = await apiCreateBunnyVideo(data.title);
                newVideoId = createVideoRes.videoId;
                await apiUploadToBunny(data.videoFile!, createVideoRes.uploadUrl, createVideoRes.accessKey);
            }

            // Handle New Resource Upload
            if (isResourceChanged) {
                const uploadRes = await uploadResourceApi(data.resourceFile!);
                if (uploadRes) {
                    newResourceUrl = uploadRes.resourceUrl;
                }
            }

            // --- Step 2: Update Database ---
            const updateData: Parameters<typeof updateLessonApi>[1] = {
                title: data.title,
                duration: data.duration,
            };
            if (newVideoId) updateData.bunnyVideoId = newVideoId;
            if (newResourceUrl) updateData.resource = newResourceUrl;

            const updatedCourse = await updateLessonApi(lesson.id, updateData);

            // Update Store
            if (updatedCourse) {
                setCourse(updatedCourse);
                toast.success("Lesson updated successfully");
                queryClient.invalidateQueries({ queryKey: ["courses"] });
                onSuccess();
            }

        } catch (error) {
            console.error("Lesson update failed:", error);
            toast.error("Failed to update lesson");

            // --- Step 3: Rollback newly uploaded assets on failure ---
            if (newVideoId) {
                try {
                    await deleteBunnyVideoApi(newVideoId);
                    console.log("Rolled back new video upload");
                } catch (e) {
                    console.error("Failed to rollback video:", e);
                }
            }

            if (newResourceUrl) {
                try {
                    await deleteResourceFileApi(newResourceUrl);
                    console.log("Rolled back new resource upload");
                } catch (e) {
                    console.error("Failed to rollback resource:", e);
                }
            }
        }
    };

    const handleDeleteResource = async () => {
        const resourceId = lesson.resource?.[0]?.id;
        if (!resourceId) return;

        setIsDeletingResource(true);
        try {
            const updatedCourse = await deleteResourceApi(resourceId);
            if (updatedCourse) {
                setCourse(updatedCourse);
                queryClient.invalidateQueries({ queryKey: ["courses"] });
                toast.success("Resource deleted successfully");
            }
        } catch (error) {
            console.error("Resource deletion failed:", error);
            toast.error("Failed to delete resource");
        } finally {
            setIsDeletingResource(false);
            setIsConfirmModalOpen(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-md border border-richblack-600 bg-richblack-800 p-4" key={submitCount}>
            <h3 className="text-lg font-semibold text-richblack-5">Edit Lesson</h3>

            <Input
                label="Lesson Title"
                name="title"
                register={register}
                validation={{ required: "Title is required" }}
                placeholder="Enter lesson title"
                error={errors}
            />

            <div className="w-full">
                <UploadVideo
                    name="videoFile"
                    label="Change Lesson Video"
                    register={register}
                    setValue={setValue}
                    errors={errors}
                    optional={true}
                    onDurationChange={(duration) => setValue("duration", duration)}
                />
                {lesson.bunnyVideoId && !isSubmitting && (
                    <div className="mt-2 flex items-center justify-between rounded-md bg-richblack-700 p-2 border border-richblack-600">
                        <span className="text-xs text-richblack-100 truncate flex-1 mr-2">
                            Existing Video: {lesson.bunnyVideoId}
                        </span>
                        <button
                            type="button"
                            onClick={() => setShowVideoPreview(!showVideoPreview)}
                            className="text-yellow-50 hover:text-yellow-25 text-xs font-medium"
                        >
                            {showVideoPreview ? "Hide Preview" : "View Existing Video"}
                        </button>
                    </div>
                )}
                {showVideoPreview && lesson.bunnyVideoId && !isSubmitting && (
                    <div className="mt-2 rounded-md overflow-hidden border border-richblack-600">
                        <BunnyPlayer videoId={lesson.bunnyVideoId} />
                    </div>
                )}
            </div>

            {!hasVideo ? (
                <div className="w-full">
                    <Input
                        label="Duration (min)"
                        name="duration"
                        type="number"
                        register={register}
                        validation={{ required: "Duration is required", valueAsNumber: true, min: 1 }}
                        error={errors}
                    />
                </div>
            ) : (
                <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-richblack-5">Duration</label>
                    <div className="rounded-md bg-richblack-700 p-3 border border-richblack-600 text-richblack-5 text-sm">
                        {duration ? `${duration} mins ${videoFile ? "(Auto-calculated)" : ""}` : "Calculating duration..."}
                    </div>
                    <input type="hidden" {...register("duration", { required: true, valueAsNumber: true })} />
                </div>
            )}

            <div>
                <UploadResource
                    name="resourceFile"
                    label="Change Resource"
                    register={register}
                    setValue={setValue}
                    errors={errors}
                    initialResource={null}
                />
                {lesson.resource && lesson.resource.length > 0 && !isSubmitting && (
                    <div className="mt-2 flex items-center justify-between rounded-md bg-richblack-700 p-2 border border-richblack-600">
                        <span className="text-xs text-richblack-100 truncate flex-1 mr-2">
                            {lesson.resource[0].url.split('/').pop()}
                        </span>
                        <button
                            type="button"
                            onClick={() => setIsConfirmModalOpen(true)}
                            className="text-pink-200 hover:text-pink-100 text-xs font-medium"
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>

            <ConfirmModal
                isOpen={isConfirmModalOpen}
                title="Delete Resource?"
                description="This will permanently delete the resource file. This action cannot be undone."
                onConfirm={handleDeleteResource}
                onCancel={() => setIsConfirmModalOpen(false)}
                loading={isDeletingResource}
                confirmText="Delete"
                variant="danger"
            />

            <div className="flex justify-end gap-x-2 pt-2">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Updating..." : "Update Lesson"}
                </Button>
            </div>
        </form>
    );
};
