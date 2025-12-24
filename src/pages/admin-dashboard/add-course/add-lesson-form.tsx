import { useForm } from "react-hook-form";
import Input from "../../../components/core/input";
import Button from "../../../components/core/button";
import UploadVideo from "../../../components/core/upload-video";
import { apiCreateBunnyVideo, apiUploadToBunny, deleteBunnyVideoApi } from "../../../service/api/bunny.apis";

import { createLessonApi, uploadResourceApi } from "../../../service/api/course.api";
import UploadResource from "../../../components/core/upload-resource";
import { queryClient } from "../../../main";
import { useCourseStore } from "../../../store/course.store";

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
    const { register, handleSubmit, setValue, formState: { errors, submitCount } } = useForm<AddLessonFormValues>();
    const setCourse = useCourseStore((state) => state?.setCourse);
    const onSubmit = async (data: AddLessonFormValues) => {
        let resourceUrl = '';
        let videoId = '';

        try {
            // --- Step 1: Create Video Entry in Bunny ---
            const createVideoRes = await apiCreateBunnyVideo(data.title);
            videoId = createVideoRes.videoId; // Store videoId for potential cleanup

            // --- Step 2: Upload Video File ---
            await apiUploadToBunny(data.videoFile, createVideoRes.uploadUrl, createVideoRes.accessKey);


            // --- Step 3: Handle Resource File Upload (Optional) ---
            if (data.resourceFile && data.resourceFile.size > 0) {
                // Determine if file type is valid (PDF, Word, etc.) - logic kept from original but could be moved to util
                const isValidType = data.resourceFile.type.startsWith("application/pdf") ||
                    data.resourceFile.type.startsWith("application/msword") ||
                    data.resourceFile.type.startsWith("application/vnd.openxmlformats-officedocument.wordprocessingml.document");

                if (isValidType) {
                    try {
                        const uploadRes = await uploadResourceApi(data.resourceFile);
                        // Ensure we extract the string URL from the response object
                        if (uploadRes) {
                            resourceUrl = uploadRes?.resourceUrl;
                        }
                    } catch (resError) {
                        await deleteBunnyVideoApi(videoId);
                        // If resource upload fails, we should probably rollback the video upload to avoid partial state
                        // The original code did this, so we preserve that behavior
                        throw resError;
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
            // set new course in the course store and  invalidate course query
            setCourse(course)
            queryClient.invalidateQueries({ queryKey: ["courses"] });
            onSuccess();

        } catch (error) {
            console.error("Lesson creation failed:", error);
            // Cleanup: If video was created/uploaded but the process failed later (e.g., resource upload or lesson creation)
            if (videoId) {
                try {
                    await deleteBunnyVideoApi(videoId);
                    console.log("Rolled back bunny video due to error");
                } catch (cleanupError) {
                    console.error("Failed to cleanup bunny video:", cleanupError);
                }
            }
        }
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
                    />
                </div>
            </div>

            <div className="w-full">
                <Input
                    label="Duration (min)"
                    name="duration"
                    type="number"
                    register={register}
                    validation={{ required: "Duration is required", valueAsNumber: true, min: 1 }}
                    // placeholder="0"
                    error={errors}
                />
            </div>

            <div>
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
                    variant="ghost"
                    onClick={onCancel}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                >
                    Save Lesson
                </Button>
            </div>
        </form>
    );
};
