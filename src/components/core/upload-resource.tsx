import { useEffect, useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { FiUploadCloud } from "react-icons/fi"
import { FaTimes, FaFilePdf } from "react-icons/fa"
import type { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form"

type UploadResourceProps = {
    name: string;
    label: string;
    register: UseFormRegister<any>;
    setValue: UseFormSetValue<any>;
    errors: FieldErrors;
    initialResource?: string | null;
    className?: string;
}

// allow only pdf, doc, docx
export default function UploadResource({
    name,
    label,
    register,
    setValue,
    errors,
    initialResource = null,
    className
}: UploadResourceProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewSource, setPreviewSource] = useState<string | null>(initialResource || null)

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0]
        if (file) {
            setPreviewSource(file.name)
            setSelectedFile(file)
        }
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: { "application/pdf": [".pdf"], "application/msword": [".doc"], "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"] },
        onDrop,
        multiple: false,
    })

    useEffect(() => {
        // mark this register optional when no preview source
        register(name)
    }, [register, name])

    useEffect(() => {
        setValue(name, selectedFile)
    }, [selectedFile, setValue, name])


    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreviewSource(null)
        setSelectedFile(null)
        setValue(name, null)
    }

    return (
        <div className={`flex flex-col space-y-2 w-full ${className}`}>
            <label className="text-sm font-medium text-richblack-5" htmlFor={name}>

            </label>

            <div
                className={`${isDragActive ? "bg-richblack-600 border-yellow-50" : "bg-richblack-700 border-richblack-600"
                    } relative flex min-h-[150px] cursor-pointer items-center justify-center rounded-lg border-2 border-dotted transition-all duration-200 hover:border-yellow-50`}
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

                        <div className="rounded-md flex flex-col justify-center items-center h-full w-full gap-2">
                            <FaFilePdf size={40} className="text-pink-200" />
                            <p className="text-richblack-5 font-medium truncate max-w-[200px]">
                                {previewSource.startsWith("http") ? "Existing PDF" : previewSource}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div
                        className="flex w-full flex-col items-center justify-center p-6 gap-4"
                        {...getRootProps()}
                    >
                        <input {...getInputProps()} />
                        <div className="grid aspect-square w-12 place-items-center rounded-full bg-pure-greys-800 shadow-sm">
                            <FiUploadCloud className="text-2xl text-yellow-50" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-medium text-richblack-200">
                                Drag and drop a PDF, or click to{" "}
                                <span className="font-bold text-yellow-50 hover:underline">
                                    Browse
                                </span>
                            </p>
                            <p className="mt-2 text-xs text-richblack-400">
                                Max file size: 6MB • PDF
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
