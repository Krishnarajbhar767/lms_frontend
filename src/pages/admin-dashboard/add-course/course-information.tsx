"use no memo";
import { useForm } from "react-hook-form";
import Input from "../../../components/core/input";
import Button from "../../../components/core/button";
import UploadImage from "../../../components/core/upload-image";
import DropdownInput from "../../../components/core/dropdown-input";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAllCategories } from "../../../service/api/categories.api";
import { GrLinkNext } from "react-icons/gr";
import { LANGUAGES } from "../../../utils/language";
import { useEffect, useState } from "react";
import type { Category } from "../../../components/core/navbar";
import { Skeleton } from "../../../components/core/skeleton";
import { createCourse, updateCourse, uploadThumbnail, type Course } from "../../../service/api/course.api";
import toast from "react-hot-toast";
import { useCourseStore } from "../../../store/course.store";
import { useStepsStore } from "../../../store/steps.store";
import { queryClient } from '../../../main'
interface CourseInformationFormValues {
    title: string;
    description: string;
    price: number;
    thumbnail: File | undefined | string;
    categoryId: number;
    language: string

}
export const CourseInformationForm = () => {
    const [categories, setCategories] = useState<Category[]>([])
    const course = useCourseStore((state) => state.course)
    const setCourse = useCourseStore((state) => state.setCourse)
    const nextStep = useStepsStore((state) => state.nextStep)
    const { data, isLoading } = useQuery<Category[]>({
        queryKey: ["categories"],
        queryFn: getAllCategories,
        staleTime: 60 * 60 * 1000,
    })
    const { register, handleSubmit, setValue, reset, formState: { errors, isSubmitting, submitCount } } = useForm<CourseInformationFormValues>({
        defaultValues: {
            title: course?.title || "",
            description: course?.description || "",
            thumbnail: course?.thumbnail || undefined,
            price: course?.price || 0,
            categoryId: course?.categoryId || "" as unknown as number, // Default to empty string to show placeholder
            language: course?.language || LANGUAGES[0].value,
        }
    })

    useEffect(() => {
        if (course) {
            // Find matching language case-insensitively
            const matchingLanguage = LANGUAGES.find(
                (l) => l.value.toLowerCase() === course.language?.toLowerCase()
            );

            reset({
                title: course.title || "",
                description: course.description || "",
                thumbnail: course.thumbnail || undefined,
                price: course.price || 0,
                categoryId: course.categoryId,
                language: matchingLanguage?.value || LANGUAGES[0].value,
            })
        }
    }, [course, reset])

    const onSubmit = async (data: CourseInformationFormValues) => {
        if (course) {
            const isThumbnailChanged = data.thumbnail instanceof File
            const isTitleChanged = course.title !== data.title
            const isDescriptionChanged = course.description !== data.description
            const isPriceChanged = course.price !== Number(data.price)
            const isCategoryChanged = course.categoryId !== Number(data.categoryId)
            const isLanguageChanged = course.language?.toLowerCase() !== data.language?.toLowerCase()

            if (!isThumbnailChanged && !isTitleChanged && !isDescriptionChanged && !isPriceChanged && !isCategoryChanged && !isLanguageChanged) {
                nextStep()
                return
            }
        }

        let thumbnailUrl = data.thumbnail;

        // If the thumbnail is a File, upload it.
        if (data.thumbnail instanceof File) {
            try {
                const uploaded = await uploadThumbnail(data.thumbnail, data.title, course?.id ? true : false)
                if (uploaded) {
                    thumbnailUrl = uploaded
                    console.log("thumbnail uploaded", thumbnailUrl)
                }
            } catch (error: any) {
                toast.error(error?.response?.data?.message || "Failed to upload thumbnail")
                return
            }
        }

        // Construct the course object
        const courseData: Course = {
            ...course, // Spread existing course data to keep ID and other fields
            title: data.title,
            description: data.description,
            price: Number(data.price),
            categoryId: Number(data.categoryId),
            language: data.language.toLocaleUpperCase(),
            thumbnail: thumbnailUrl as string,
        };

        if (course?.id) {
            await updateCourseMutation(courseData)
        } else {
            await createCourseMutation(courseData)
        }
        // invalidate  query  startwith => courses
        queryClient.invalidateQueries({
            queryKey: ["courses"],
        })
    }

    // create course mutation
    const { mutateAsync: createCourseMutation } = useMutation({
        mutationFn: createCourse,
        onSuccess: (data) => {
            toast.success("Course created successfully")
            setCourse(data)
            nextStep()
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to create course")
        }
    })
    // update course mutation 
    const { mutateAsync: updateCourseMutation } = useMutation({
        mutationFn: updateCourse,
        onSuccess: (data) => {
            setCourse(data)
            nextStep()
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to update course")
        }
    })
    // once categories are fetched, set them to state
    useEffect(() => {
        if (data) {
            setCategories(data)
        }
    }, [data])

    // if categories are not fetched, show skeleton
    if (isLoading) {
        return <CourseInformationFormSkeleton />
    }
    return (

        <form key={submitCount} onSubmit={handleSubmit(onSubmit)} className="bg-[#161d29] p-6 rounded-lg space-y-4">
            <Input
                label="Title"
                type="text" {...register("title")}
                error={errors}
                register={register}
                name="title"
                validation={{ required: 'Title is required' }}
                placeholder="Enter course title" />

            <Input
                label="Description"
                type="text" {...register("description")}
                error={errors}
                register={register}
                name="description" validation={{ required: 'Description is required' }}
                placeholder="Enter course description" />

            <Input
                label="Price"
                type="number" {...register("price")}
                error={errors} register={register} name="price"
                validation={{ required: 'Price is required', min: { value: 0, message: 'Invalid price' }, max: { value: 1000000, message: 'Price must be at most 1000000' } }}
                placeholder="Enter course price"

            />


            {/* Language dropdown for selecte */}
            <DropdownInput
                label="Language"
                name="language"
                register={register}
                error={errors}
                validation={{ required: 'Language is required' }}
                options={LANGUAGES}
                placeholder="Select a language"
                className="capitalize"
            />

            <DropdownInput
                label="Category"
                name="categoryId"
                register={register}
                error={errors}
                validation={{ required: 'Category is required' }}
                options={categories}
                placeholder="Select a category"
                className="capitalize"
            />

            <UploadImage
                name="thumbnail"
                label="Course Thumbnail"
                register={register}
                setValue={setValue}
                errors={errors}
                initialImage={course?.thumbnail}
            />
            {/* Requirements */}


            <div className="flex justify-end">
                <Button type="submit" className="w-fit flex items-center gap-2" disabled={isSubmitting}>
                    {course ? "Save and Continue" : "Next"} <GrLinkNext />
                </Button>
            </div>
        </form>
    )
}

const CourseInformationFormSkeleton = () => {
    return (
        <div className="bg-[#161d29] p-6 rounded-lg space-y-4">
            {/* Title Skeleton */}
            <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-[50px]" />
                <Skeleton className="h-[48px] w-full rounded-lg" />
            </div>

            {/* Description Skeleton */}
            <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-[80px]" />
                <Skeleton className="h-[48px] w-full rounded-lg" />
            </div>

            {/* Price Skeleton */}
            <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-[60px]" />
                <Skeleton className="h-[48px] w-full rounded-lg" />
            </div>

            {/* Language Skeleton */}
            <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-[70px]" />
                <Skeleton className="h-[48px] w-full rounded-lg" />
            </div>

            {/* Category Skeleton */}
            <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-[70px]" />
                <Skeleton className="h-[48px] w-full rounded-lg" />
            </div>

            {/* Thumbnail Skeleton */}
            <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-[120px]" />
                <Skeleton className="h-[250px] w-full rounded-lg" />
            </div>

            {/* Button Skeleton */}
            <div className="flex justify-end">
                <Skeleton className="h-[40px] w-[70px] rounded-lg" />
            </div>
        </div>
    )
}