import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { VscAdd } from 'react-icons/vsc';

import {
    getAllCategoriesApi,
    deleteCategoryApi
} from '../../../service/api/category.api';
import type { Category } from '../../../service/api/category.api';
import Button from '../../../components/core/button';
import DeleteCategoryModal from './delete-category-modal';
import CategoryForm from './category-form';
import { AdminCategoryTable, CategoryTableSkeleton } from './admin-category-table';

export default function CategoryPage() {
    const queryClient = useQueryClient();

    // View State: 'list' | 'add' | 'edit'
    const [view, setView] = useState<'list' | 'add' | 'edit'>('list');

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    // Fetch Categories
    const { data: categories = [], isLoading } = useQuery({
        queryKey: ['admin-categories'],
        queryFn: () => getAllCategoriesApi(true), // Fetch all for admin
    });

    // Delete Category Mutation
    const deleteMutation = useMutation({
        mutationFn: (data: { id: number, targetCategoryId?: number }) =>
            deleteCategoryApi(data.id, data.targetCategoryId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
            toast.success("Category deleted successfully");
            handleCloseDeleteModal();
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to delete category");
        }
    });

    const handleEdit = (category: Category) => {
        setSelectedCategory(category);
        setView('edit');
    };

    const handleOpenDeleteModal = (category: Category) => {
        setSelectedCategory(category);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setSelectedCategory(null);
        setIsDeleteModalOpen(false);
    };

    const handleDelete = (id: number, targetCategoryId?: number) => {
        deleteMutation.mutate({ id, targetCategoryId });
    };

    const handleFormCancel = () => {
        setSelectedCategory(null);
        setView('list');
    };

    const handleFormSuccess = () => {
        setSelectedCategory(null);
        setView('list');
    };

    return (
        <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6">
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-3xl font-medium text-richblack-5">Category Management</h1>
                {view === 'list' && (
                    <Button onClick={() => setView('add')} className="flex items-center gap-x-2">
                        <VscAdd className="text-lg" />
                        <span>Add Category</span>
                    </Button>
                )}
            </div>

            {view === 'list' ? (
                isLoading ? (
                    <CategoryTableSkeleton />
                ) : (
                    <AdminCategoryTable
                        categories={categories}
                        onEdit={handleEdit}
                        onDelete={handleOpenDeleteModal}
                    />
                )
            ) : (
                <CategoryForm
                    initialData={view === 'edit' ? selectedCategory : null}
                    onCancel={handleFormCancel}
                    onSuccess={handleFormSuccess}
                />
            )}

            <DeleteCategoryModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onDelete={handleDelete}
                category={selectedCategory}
                allCategories={categories}
                isDeleting={deleteMutation.isPending}
            />
        </div>
    );
}
