import React from 'react';
import { IoCloudUploadOutline } from "react-icons/io5";

interface UploadProgressCardProps {
    progress: number;
    className?: string;
    isResource?: boolean;
    fileName?: string;
}

const UploadProgressCard: React.FC<UploadProgressCardProps> = ({ progress, className, isResource, fileName }) => {
    const isVisible = progress > 0 && progress <= 100;

    return (
        <div className={`fixed bottom-4 right-4 z-50 w-80 bg-richblack-800 border border-richblack-700 rounded-lg shadow-xl p-4 transition-all duration-300 transform 
            ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"} 
            ${className || ''}`}
        >
            <div className="flex items-center gap-3">
                <div className="p-2 bg-richblack-700 rounded-full">
                    <IoCloudUploadOutline className="text-yellow-50 text-xl" />
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-medium text-richblack-5">
                                {isResource ? "Uploading Resource" : "Uploading Video"}
                            </span>
                            {fileName && (
                                <span className="text-xs text-richblack-200 truncate max-w-[200px]">
                                    {fileName}
                                </span>
                            )}
                        </div>
                        <span className="text-sm font-bold text-yellow-50">{progress}%</span>
                    </div>
                    <div className="w-full bg-richblack-700 rounded-full h-2">
                        <div
                            className="bg-yellow-50 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadProgressCard;
