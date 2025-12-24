import { useEffect } from "react";
import { RxCross2 } from "react-icons/rx";

interface ConfirmModalProps {
    isOpen: boolean;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "primary" | "neutral";
    loading?: boolean;

    onConfirm: () => void;
    onCancel: () => void;
}

const VARIANT_STYLES = {
    danger: "bg-pink-200 hover:bg-pink-100 text-richblack-900",
    primary: "bg-yellow-50 hover:bg-yellow-25 text-richblack-900",
    neutral: "bg-richblack-700 hover:bg-richblack-600 text-richblack-5",
};

export default function ConfirmModal({
    isOpen,
    title = "Are you sure?",
    description = "This action cannot be undone.",
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "danger",
    loading = false,
    onConfirm,
    onCancel,
}: ConfirmModalProps) {

    useEffect(() => {
        if (isOpen) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    // ESC to close
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onCancel();
        };
        if (isOpen) window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [isOpen, onCancel]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-6 py-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm "
                onClick={onCancel}
            />

            {/* Modal */}
            <div className=" relative z-10 w-full max-w-md rounded-xl bg-richblack-800 border border-richblack-700 shadow-2xl animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-richblack-700">
                    <h2 className="text-lg font-semibold text-richblack-5">
                        {title}
                    </h2>
                    <button
                        onClick={onCancel}
                        className="text-richblack-300 hover:text-richblack-5 transition cursor-pointer"
                    >
                        <RxCross2 size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-4">
                    <p className="text-sm text-richblack-300 leading-relaxed">
                        {description}
                    </p>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 px-6 py-4 border-t border-richblack-700">
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="cursor-pointer px-4 py-2 rounded-md bg-richblack-700 hover:bg-richblack-600 text-richblack-5 text-sm transition disabled:opacity-50"
                    >
                        {cancelText}
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className={`cursor-pointer px-4 py-2 rounded-md text-sm font-medium transition disabled:opacity-50 ${VARIANT_STYLES[variant]}`}
                    >
                        {loading ? "Please wait..." : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
