import { useEffect, useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { FiUploadCloud } from "react-icons/fi"
import { FaTimes } from "react-icons/fa"
import type { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form"

type UploadImageProps = {
    name: string;
    label: string;
    register: UseFormRegister<any>;
    setValue: UseFormSetValue<any>;
    errors: FieldErrors;
    initialImage?: string | null;  // Simplified: one prop for existing image
    className?: string;
}

export default function UploadImage({
    name,
    label,
    register,
    setValue,
    errors,
    initialImage = null,
    className
}: UploadImageProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewSource, setPreviewSource] = useState<string | null>(initialImage || null)

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0]
        if (file) {
            previewFile(file)
            setSelectedFile(file)
            setValue(name, file)
        }
    }, [setValue, name])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
        onDrop,
        multiple: false,
    })

    const previewFile = (file: File) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = () => {
            setPreviewSource(reader.result as string)
        }
    }

    // Register field
    useEffect(() => {
        register(name, { required: !previewSource }) // Required only if no preview (existing or new)
    }, [register, name, previewSource])

    // Sync initialImage if it changes (e.g. valid data fetched later)
    useEffect(() => {
        if (initialImage && !selectedFile) {
            setPreviewSource(initialImage)
        }
    }, [initialImage, selectedFile])


    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreviewSource(null)
        setSelectedFile(null)
        setValue(name, null)
    }

    return (
        <div className={`flex flex-col space-y-2 w-full ${className}`}>
            <label className="text-sm font-medium text-richblack-5" htmlFor={name}>
                {label} {!previewSource && <sup className="text-pink-200">*</sup>}
            </label>

            <div
                className={`${isDragActive ? "bg-richblack-600 border-yellow-50" : "bg-richblack-700 border-richblack-600"
                    } relative flex min-h-[250px] cursor-pointer items-center justify-center rounded-lg border-2 border-dotted transition-all duration-200 hover:border-yellow-50`}
            >
                {previewSource ? (
                    <div className="flex w-full flex-col p-4 relative h-full">
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="absolute top-2 right-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70 z-10 transition-colors"
                        >
                            <FaTimes />
                        </button>

                        <div className="overflow-hidden rounded-md flex justify-center items-center bg-black h-full w-full">
                            <img
                                src={previewSource}
                                alt="Preview"
                                className="h-full w-full object-contain max-h-[300px]"
                            />
                        </div>
                    </div>
                ) : (
                    <div
                        className="flex w-full flex-col items-center justify-center p-6 gap-4"
                        {...getRootProps()}
                    >
                        <input {...getInputProps()} />
                        <div className="grid aspect-square w-16 place-items-center rounded-full bg-pure-greys-800 shadow-sm">
                            <FiUploadCloud className="text-3xl text-yellow-50" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-medium text-richblack-200">
                                Drag and drop an image, or click to{" "}
                                <span className="font-bold text-yellow-50 hover:underline">
                                    Browse
                                </span>
                            </p>
                            <p className="mt-2 text-xs text-richblack-400">
                                Max file size: 6MB • JPG, PNG, WEBP
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {errors[name] && (
                <span className="ml-1 text-xs tracking-wide text-pink-200 animate-pulse">
                    {(errors[name]?.message as string) || `${label} is required`}
                </span>
            )}
        </div>
    )
}
