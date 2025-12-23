import React from "react";
import type { FieldValues, UseFormRegister, FieldErrors } from "react-hook-form";

type Props = Readonly<{
    type?: "email" | "text" | "password" | "file" | "number";
    label: string;
    name: keyof FieldValues;
    initialValue?: string;
    placeholder?: string;
    register: UseFormRegister<any>;
    error: FieldErrors<FieldValues>;
    className?: string;
    children?: React.ReactNode;
    validation?: any;
}>;

function Input({
    type = "text",
    label,
    name,
    initialValue,
    placeholder,
    register,
    error,
    children,
    className,
    validation = {},
}: Props) {
    return (
        <div className="flex flex-col gap-2 w-full">
            {label && (
                <label
                    htmlFor={name as string}
                    className="mb-1 text-[0.875rem] leading-5.5 text-richblack-5"
                >
                    {label} {validation?.required && <sup className="text-pink-200">*</sup>}
                </label>
            )}

            <div className="relative flex items-center">
                <input
                    id={name as string}
                    type={type}
                    defaultValue={initialValue || ""}
                    placeholder={placeholder || ""}
                    {...register(name as string, validation)}
                    className={`w-full rounded-lg bg-richblack-700 p-[12px] pr-12 text-richblack-5
            focus:outline-none focus:ring-1 focus:ring-yellow-50
            shadow-inner border-0 ${className}`}
                    style={{
                        boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                    }}
                />

                {children && (
                    <div className="absolute right-3 top-[50%] -translate-y-1/2 cursor-pointer select-none">
                        {children}
                    </div>
                )}
            </div>

            {error?.[name] && (
                <span className="text-red-500 text-[0.875rem]">
                    {(error?.[name]?.message as string) || "Something went wrong"}
                </span>
            )}
        </div>
    );
}

export default Input;
