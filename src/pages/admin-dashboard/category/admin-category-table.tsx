import { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
    ClientSideRowModelModule,
    ModuleRegistry,
    ValidationModule,
    TextFilterModule,
    NumberFilterModule,
    PaginationModule,
    RowSelectionModule,
    themeQuartz
} from 'ag-grid-community';
import type { ColDef } from 'ag-grid-community';
import { VscEdit, VscTrash } from 'react-icons/vsc';
import { Skeleton } from '../../../components/core/skeleton';
import type { Category } from '../../../service/api/category.api';

// Register AG Grid Modules
ModuleRegistry.registerModules([
    ClientSideRowModelModule,
    ValidationModule,
    TextFilterModule,
    NumberFilterModule,
    PaginationModule,
    RowSelectionModule
]);

interface AdminCategoryTableProps {
    categories: Category[];
    onEdit: (category: Category) => void;
    onDelete: (category: Category) => void;
}

export const AdminCategoryTable = ({ categories, onEdit, onDelete }: AdminCategoryTableProps) => {

    const columnDefs = useMemo<ColDef<Category>[]>(() => [
        {
            field: 'name',
            headerName: 'Category Name',
            flex: 1,
            filter: 'agTextColumnFilter',
            floatingFilter: true,
        },
        {
            field: 'description',
            headerName: 'Description',
            flex: 2,
            // filter: 'agTextColumnFilter',
            // floatingFilter: true,
        },
        {
            headerName: 'Courses',
            field: '_count.courses',
            valueGetter: (params) => params.data?._count?.courses || 0,
            flex: 0.5,
            filter: false,
        },
        {
            headerName: 'Actions',
            flex: 0.5,
            sortable: false,
            filter: false,
            cellRenderer: (params: any) => {
                const category = params.data;
                return (
                    <div className="flex items-center gap-x-2 h-full">
                        <button
                            onClick={() => onEdit(category)}
                            className="px-2 transition-all duration-200 hover:scale-110 hover:text-caribbeangreen-300 cursor-pointer"
                        >
                            <VscEdit size={20} />
                        </button>
                        <button
                            onClick={() => onDelete(category)}
                            className="px-2 transition-all duration-200 hover:scale-110 hover:text-pink-200 cursor-pointer"
                        >
                            <VscTrash size={20} />
                        </button>
                    </div>
                );
            }
        }
    ], [onEdit, onDelete]);

    return (
        <div
            className="ag-theme-custom-dark bg-richblack-800 border border-richblack-700 rounded-xl shadow-2xl overflow-hidden"
            style={{ height: 600 }}
        >
            <AgGridReact
                theme={themeQuartz}
                rowData={categories}
                columnDefs={columnDefs}
                pagination={true}
                paginationPageSize={10}
                paginationPageSizeSelector={[10, 20, 50]}
                suppressCellFocus
                suppressRowClickSelection
                rowSelection="single"
                headerHeight={48}
                rowHeight={56}
            />
        </div>
    );
};

export const CategoryTableSkeleton = () => {
    return (
        <div className="w-full flex flex-col gap-4 animate-pulse">
            <div className="bg-richblack-800 rounded-xl overflow-hidden border border-richblack-700 shadow-2xl">
                {/* Header Skeleton */}
                <div className="bg-richblack-700 h-12 flex items-center px-4 gap-4">
                    <Skeleton className="h-4 flex-1 bg-richblack-600" />
                    <Skeleton className="h-4 flex-[2] bg-richblack-600" />
                    <Skeleton className="h-4 flex-[0.5] bg-richblack-600" />
                    <Skeleton className="h-4 flex-[0.5] bg-richblack-600" />
                </div>
                {/* Row Skeletons */}
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-14 flex items-center px-4 gap-4 border-b border-richblack-700">
                        <Skeleton className="h-4 flex-1 bg-richblack-700" />
                        <Skeleton className="h-4 flex-[2] bg-richblack-700" />
                        <Skeleton className="h-4 flex-[0.5] bg-richblack-700" />
                        <Skeleton className="h-4 flex-[0.5] bg-richblack-700" />
                    </div>
                ))}
            </div>
            {/* Pagination Skeleton */}
            <div className="h-12 bg-richblack-800 border border-richblack-700 rounded-xl flex items-center justify-between px-6 mt-4">
                <Skeleton className="h-4 w-48 bg-richblack-700" />
                <Skeleton className="h-8 w-64 rounded-md bg-richblack-700" />
            </div>
        </div>
    );
};
