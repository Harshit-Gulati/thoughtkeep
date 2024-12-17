import { ReactElement } from "react";

export interface ButtonProps {
  variant: "primary" | "secondary";
  size: "sm" | "md" | "lg";
  rounded: "none" | "md" | "lg" | "xl";
  text: string;
  loading?: boolean;
  fullWidth?: boolean;
  startIcon?: ReactElement;
  endIcon?: any;
  onClick?: () => void;
}

const variantStyles = {
  primary: "bg-purple-700 text-white border border-white ",
  secondary: "bg-gray-100 text-purple-700 border border-purple-700 ",
};

const sizeStyles = {
  sm: "px-2 py-2 text-base ",
  md: "px-2 py-2 ",
  lg: "px-3 py-2 ",
};

const roundedStyle = {
  none: "rounded-none",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-3xl",
};

const defaultStyles =
  "transition-all font-semibold hover:opacity-80 flex justify-center items-center ";

export const Button = (props: ButtonProps) => {
  return (
    <button
      className={`${defaultStyles} ${variantStyles[props.variant]} ${
        sizeStyles[props.size]
      } ${roundedStyle[props.rounded]} ${props.fullWidth ? `w-full` : ``} ${
        props.loading ? `cursor-not-allowed opacity-80` : ``
      }`}
      onClick={props.onClick}
      disabled={props.loading}
    >
      {props.loading && (
        <>
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Processing...
        </>
      )}
      {!props.loading && (
        <>
          {props.startIcon}
          <span>&nbsp;</span>
          {props.text}
          <span>&nbsp;</span>
          {props.endIcon}
        </>
      )}
    </button>
  );
};
