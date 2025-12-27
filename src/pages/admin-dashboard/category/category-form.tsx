import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import Button from '../../../components/core/button';
import Input from '../../../components/core/input';
import {
    createCategoryApi,
    updateCategoryApi,
    type Category
} from '../../../service/api/category.api';
import { MdOutlineCancel, MdOutlineSave } from 'react-icons/md';

interface CategoryFormProps {
    initialData?: Category | null;
    onCancel: () => void;
    onSuccess: () => void;
}

interface FormData {
    name: string;
    description: string;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ initialData, onCancel, onSuccess }) => {
    const queryClient = useQueryClient();
    const isEditing = !!initialData;

    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<FormData>({
        defaultValues: {
            name: '',
            description: ''
        }
    });

    useEffect(() => {
        if (initialData) {
            setValue('name', initialData.name);
            setValue('description', initialData.description);
        }
    }, [initialData, setValue]);

    const createMutation = useMutation({
        mutationFn: createCategoryApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
            toast.success("Category created successfully");
            reset();
            onSuccess();
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to create category");
        }
    });

    const updateMutation = useMutation({
        mutationFn: (data: FormData) => updateCategoryApi(initialData!.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
            toast.success("Category updated successfully");
            onSuccess();
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to update category");
        }
    });

    const onSubmit = (data: FormData) => {
        if (isEditing) {
            updateMutation.mutate(data);
        } else {
            createMutation.mutate(data);
        }
    };

    const isSubmitting = createMutation.isPending || updateMutation.isPending;

    return (
        <div className="rounded-xl border border-richblack-700 bg-richblack-800 p-6">
            <h2 className="mb-6 text-xl font-medium text-richblack-5">
                {isEditing ? "Edit Category" : "Add Category"}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-6">
                <Input
                    label="Category Name"
                    name="name"
                    placeholder="Enter category name"
                    register={register}
                    error={errors}
                    validation={{ required: "Category name is required" }}
                />

                <div className="flex flex-col gap-2">
                    <label className="text-sm text-richblack-5">Description</label>
                    <textarea
                        className="form-style min-h-[120px] w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 border border-richblack-600 focus:outline-none focus:border-yellow-50"
                        placeholder="Enter description"
                        {...register("description", { required: "Description is required" })}
                        disabled={isSubmitting}
                    />
                    {errors.description && (
                        <span className="text-xs text-pink-200">{errors.description.message}</span>
                    )}
                </div>

                <div className="flex justify-end gap-x-3 mt-4">
                    <Button
                        variant="secondary"
                        onClick={onCancel}
                        disabled={isSubmitting}
                        type="button"
                        className='flex items-center gap-x-2'
                    >
                        Cancel <MdOutlineCancel />
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        variant='primary'
                        className='flex items-center gap-x-2'


                    >
                        {isSubmitting ? "Saving..." : (isEditing ? "Save Changes" : "Create Category")} <MdOutlineSave />
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CategoryForm;
