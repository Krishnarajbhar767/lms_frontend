import React, { useState } from 'react';
import { MdDeleteForever, MdOutlineCancel, MdWarning } from 'react-icons/md';
import Button from '../../../components/core/button';
import type { Category } from '../../../service/api/category.api';

interface DeleteCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDelete: (id: number, targetCategoryId?: number) => void;
    category: Category | null;
    allCategories: Category[];
    isDeleting: boolean;
}

const DeleteCategoryModal: React.FC<DeleteCategoryModalProps> = ({
    isOpen,
    onClose,
    onDelete,
    category,
    allCategories,
    isDeleting
}) => {
    const [targetCategoryId, setTargetCategoryId] = useState<number | "">("");

    if (!isOpen || !category) return null;

    const hasCourses = (category._count?.courses || 0) > 0;
    const availableCategories = allCategories.filter(c => c.id !== category.id);

    const handleDelete = () => {
        if (hasCourses && targetCategoryId === "") return;
        onDelete(category.id, targetCategoryId === "" ? undefined : Number(targetCategoryId));
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            onClick={handleBackdropClick}
            className="fixed inset-0 z-[1000] !mt-0 grid place-items-center overflow-auto bg-white/10 backdrop-blur-sm transition-all duration-200"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="w-11/12 max-w-[500px] rounded-lg border border-richblack-400 bg-richblack-800 p-6 shadow-xl"
            >
                <div className="flex flex-col items-center text-center gap-4">
                    <div className="p-3 bg-pink-900/50 rounded-full">
                        <MdWarning className="text-3xl text-pink-200" />
                    </div>

                    <h2 className="text-2xl font-semibold text-richblack-5">Delete Category</h2>

                    <p className="text-richblack-200">
                        Are you sure you want to delete <span className="font-bold text-white">"{category.name}"</span>?
                        {hasCourses ? "" : " This action cannot be undone."}
                    </p>

                    {hasCourses && (
                        <div className="w-full text-left bg-yellow-900/20 border border-yellow-700 p-4 rounded-lg mt-2">
                            <p className="text-yellow-100 text-sm font-medium mb-3">
                                <span className="font-bold">Wait!</span> This category has {category._count?.courses} associated courses.
                            </p>
                            <p className="text-richblack-300 text-sm mb-2">
                                You must move these courses to another category before deleting.
                            </p>

                            <label className="text-sm text-richblack-5 block mb-1">Select Target Category:</label>
                            <select
                                className="form-style w-full rounded-lg bg-richblack-700 p-2 text-richblack-5 border border-richblack-600 focus:outline-none"
                                value={targetCategoryId}
                                onChange={(e) => setTargetCategoryId(Number(e.target.value))}
                            >
                                <option value="" disabled>Select a category</option>
                                {availableCategories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="flex items-center gap-x-4 mt-4 w-full justify-center">
                        <Button
                            variant="secondary"
                            onClick={onClose}
                            disabled={isDeleting}
                            className='flex items-center gap-x-2'
                        >
                            Cancel <MdOutlineCancel />
                        </Button>
                        <Button
                            onClick={handleDelete}
                            disabled={isDeleting || (hasCourses && targetCategoryId === "")}
                            className='flex items-center gap-x-2'
                            variant='danger'
                        >
                            {isDeleting ? "Deleting..." : "Delete Category"} <MdDeleteForever />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteCategoryModal;
