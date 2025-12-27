import React from "react";

type ButtonVariant =
    | "primary"
    | "secondary"
    | "outline"
    | "success"
    | "danger"
    | "ghost";

type ButtonProps = {
    children: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    variant?: ButtonVariant;
    disabled?: boolean;
    className?: string;
    type?: "button" | "submit" | "reset";
};

const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    variant = "primary",
    disabled = false,
    className = "",
    type = "button",
}) => {
    const baseStyle =
        "px-4 py-2 hover:scale-98 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 cursor-pointer";

    const variantStyles: Record<ButtonVariant, string> = {
        primary:
            "bg-yellow-50 text-richblack-900 hover:bg-yellow-100 focus:ring-yellow-50 text-richblack-800 font-medium",
        secondary:
            "bg-richblack-600 text-white hover:bg-richblack-700 focus:ring-yellow-50 border-1 border-transparent hover:border-white/50 hover:border-1",
        outline:
            "border border-white text-white hover:bg-richblack-800 hover:text-white focus:ring-yellow-50 focus:border-none font-medium",
        success: "bg-green-50 text-green-100 hover:bg-green-100 focus:ring-yellow-50",
        danger: "bg-red-50 text-red-100 hover:bg-red-100 focus:ring-yellow-50",
        ghost: "text-[#3E4070] bg-transparent hover:bg-[#EBEBF4] focus:ring-yellow-50",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyle} ${variantStyles[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : ""
                } ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;