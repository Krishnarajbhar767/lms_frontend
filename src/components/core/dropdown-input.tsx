

import type { FieldValues, UseFormRegister, FieldErrors } from "react-hook-form";
import { BsChevronDown } from "react-icons/bs";

type Option = {
    id: string | number;
    name: string;
    value?: string | number;
};

type Props = {
    label: string;
    name: keyof FieldValues;
    register: UseFormRegister<any>;
    error: FieldErrors<FieldValues>;
    validation?: any;
    options: Option[];
    placeholder?: string;
    className?: string;
    disabled?: boolean;
};

const DropdownInput = ({
    label,
    name,
    register,
    error,
    validation = {},
    options,
    placeholder = "Select an option",
    className = "",
    disabled = false,
}: Props) => {
    return (
        <div className={`flex flex-col gap-2 w-full ${className}`}>
            {label && (
                <label
                    htmlFor={name as string}
                    className="mb-1 text-[0.875rem] leading-5.5 text-richblack-5"
                >
                    {label} {validation?.required && <sup className="text-pink-200">*</sup>}
                </label>
            )}

            <div className="relative">
                <select
                    id={name as string}
                    disabled={disabled}
                    {...register(name as string, validation)}
                    defaultValue=""
                    className="w-full appearance-none rounded-lg bg-richblack-700 p-[12px] pr-10 text-richblack-5
                    focus:outline-none focus:ring-1 focus:ring-yellow-50
                    shadow-inner border-0 cursor-pointer capitalize"
                    style={{
                        boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                    }}
                >
                    <option value="" disabled className="text-richblack-200">
                        {placeholder}
                    </option>
                    {options.map((option) => (
                        <option key={option.id + option.name} value={option.value || option.id} className="capitalize">
                            {option.name}
                        </option>
                    ))}
                </select>
                <div className="absolute right-3 top-[50%] -translate-y-1/2 pointer-events-none text-richblack-200">
                    <BsChevronDown />
                </div>
            </div>

            {error?.[name] && (
                <span className="text-red-500 text-[0.875rem]">
                    {(error?.[name]?.message as string) || "Something went wrong"}
                </span>
            )}
        </div>
    );
};

export default DropdownInput;
