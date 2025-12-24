import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import Input from "../../../components/core/input";
import Button from "../../../components/core/button";
import UploadVideo from "../../../components/core/upload-video";
import { apiCreateBunnyVideo, apiUploadToBunny, deleteBunnyVideoApi } from "../../../service/api/bunny.apis";

import { createLessonApi, uploadResourceApi } from "../../../service/api/course.api";
import UploadResource from "../../../components/core/upload-resource";
import { queryClient } from "../../../main";
import { useCourseStore } from "../../../store/course.store";
import { deleteResourceFileApi } from "../../../service/api/course-builder.api";
import { IoCreateSharp } from "react-icons/io5";
import { MdOutlineCancel } from "react-icons/md";
import { useMutation } from "@tanstack/react-query";

type AddLessonFormProps = {
    sectionId: number;
    onCancel: () => void;
    onSuccess: () => void;
};

interface AddLessonFormValues {
    title: string;
    videoFile: File;
    duration: number;
    resourceFile?: File;
}

export const AddLessonForm = ({ sectionId, onCancel, onSuccess }: AddLessonFormProps) => {
    const { register, handleSubmit, setValue, watch, formState: { errors, submitCount } } = useForm<AddLessonFormValues>();
    const videoFile = watch("videoFile");
    const duration = watch("duration");
    const setCourse = useCourseStore((state) => state?.setCourse);
    const { mutateAsync: createLessonMutation, isPending: isCreating } = useMutation({
        mutationFn: async (data: AddLessonFormValues) => {
            let resourceUrl = '';
            let videoId = '';

            try {
                // --- Step 1: Create Video Entry in Bunny ---
                const createVideoRes = await apiCreateBunnyVideo(data.title);
                videoId = createVideoRes.videoId;

                // --- Step 2: Upload Video File ---
                await apiUploadToBunny(data.videoFile, createVideoRes.uploadUrl, createVideoRes.accessKey);

                // --- Step 3: Handle Resource File Upload (Optional) ---
                if (data.resourceFile && data.resourceFile.size > 0) {
                    const isValidType = data.resourceFile.type.startsWith("application/pdf") ||
                        data.resourceFile.type.startsWith("application/msword") ||
                        data.resourceFile.type.startsWith("application/vnd.openxmlformats-officedocument.wordprocessingml.document");

                    if (isValidType) {
                        const uploadRes = await uploadResourceApi(data.resourceFile);
                        if (uploadRes) {
                            resourceUrl = uploadRes?.resourceUrl;
                        }
                    }
                }

                // --- Step 4: Create Lesson in Backend ---
                const course = await createLessonApi({
                    title: data.title,
                    sectionId,
                    bunnyVideoId: videoId,
                    duration: data.duration || 0,
                    resource: resourceUrl
                });

                return { course, videoId, resourceUrl };

            } catch (error) {
                // Cleanup on failure
                if (videoId) {
                    try {
                        await deleteBunnyVideoApi(videoId);
                    } catch (cleanupError) {
                        console.error("Failed to cleanup bunny video:", cleanupError);
                    }
                }
                if (resourceUrl) {
                    try {
                        await deleteResourceFileApi(resourceUrl);
                    } catch (cleanupError) {
                        console.error("Failed to cleanup resource:", cleanupError);
                    }
                }
                throw error;
            }
        },
        onSuccess: ({ course }) => {
            setCourse(course);
            queryClient.invalidateQueries({ queryKey: ["courses"] });
            onSuccess();
            toast.success("Lesson created successfully");
        },
        onError: (error) => {
            console.error("Lesson creation failed:", error);
            toast.error("Failed to create lesson");
        }
    });

    const onSubmit = async (data: AddLessonFormValues) => {
        await createLessonMutation(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-md border border-richblack-600 bg-richblack-800 p-4" key={submitCount}>
            <h3 className="text-lg font-semibold text-richblack-5">Add New Lesson</h3>

            <Input
                label="Lesson Title"
                name="title"
                register={register}
                validation={{ required: "Title is required" }}
                placeholder="Enter lesson title"
                error={errors}
            />

            <div className="flex flex-col gap-4 md:flex-row">
                <div className="w-full">
                    <UploadVideo
                        name="videoFile"
                        label="Lesson Video"
                        register={register}
                        setValue={setValue}
                        errors={errors}
                        onDurationChange={(duration) => setValue("duration", duration)}
                    />
                </div>
            </div>

            {!videoFile ? (
                <div className="w-full">
                    <Input
                        label="Duration (min) (Auto-calculated)"
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
                        {duration ? `${duration} mins (Auto-calculated)` : "Calculating duration..."}
                    </div>
                    {/* Keep hidden input for form submission if needed, or rely on setValue */}
                    <input type="hidden" {...register("duration", { required: true, valueAsNumber: true })} />
                </div>
            )}

            <div>
                <h1 className="text-richblack-5 text-sm">Resource (Optional)</h1>
                <UploadResource
                    name="resourceFile"
                    label="Resource"
                    register={register}
                    setValue={setValue}
                    errors={errors}

                />
            </div>

            <div className="flex justify-end gap-x-2 pt-2">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
                    className="flex items-center gap-x-2 justify-center"
                >
                    Cancel
                    <MdOutlineCancel />
                </Button>
                <Button
                    type="submit"
                    disabled={isCreating}
                    className="flex items-center gap-x-2 justify-center"
                >
                    {isCreating ? "Creating..." : "Create Lesson"} <IoCreateSharp />
                </Button>
            </div>
        </form>
    );
};
