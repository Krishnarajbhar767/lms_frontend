import { useEffect, useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { FiUploadCloud } from "react-icons/fi"
import { FaTimes } from "react-icons/fa"
import type { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form"

type UploadVideoProps = {
    name: string;
    label: string;
    register: UseFormRegister<any>;
    setValue: UseFormSetValue<any>;
    errors: FieldErrors;
    initialVideo?: string | null;
    className?: string;
    optional?: boolean;
    onDurationChange?: (duration: number) => void;
}

export default function UploadVideo({
    name,
    label,
    register,
    setValue,
    errors,
    initialVideo = null,
    className,
    optional = false,
    onDurationChange,
}: UploadVideoProps) {

    const [previewSource, setPreviewSource] = useState<string | null>(initialVideo || null)

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0]
        if (file) {
            previewFile(file)

            setValue(name, file, { shouldValidate: true })
        }
    }, [setValue, name])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: { "video/*": [".mp4", ".mkv", ".mov", ".webm"] },
        onDrop,
        multiple: false,
    })

    const previewFile = (file: File) => {
        const url = URL.createObjectURL(file);
        setPreviewSource(url);

        // Extract Duration
        if (onDurationChange) {
            const video = document.createElement("video");
            video.preload = "metadata";
            video.onloadedmetadata = () => {
                // Convert to minutes and round up
                const durationInMinutes = Math.ceil(video.duration / 60);
                onDurationChange(durationInMinutes);
            };
            video.src = url;
        }
    }

    useEffect(() => {
        register(name, { required: optional ? false : !previewSource })
    }, [register, name, previewSource, optional])


    useEffect(() => {
        // Cleanup object URL to avoid memory leaks
        return () => {
            if (previewSource && previewSource.startsWith('blob:')) {
                URL.revokeObjectURL(previewSource);
            }
        }
    }, [previewSource]);


    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (previewSource && previewSource.startsWith('blob:')) {
            URL.revokeObjectURL(previewSource);
        }
        setPreviewSource(null)

        setValue(name, null, { shouldValidate: true })
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
                            <video
                                controls
                                className="w-full max-h-[300px]"
                                src={previewSource}
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
                                Drag and drop a video, or click to{" "}
                                <span className="font-bold text-yellow-50 hover:underline">
                                    Browse
                                </span>
                            </p>
                            <p className="mt-2 text-xs text-richblack-400">
                                MP4, MKV, MOV
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
