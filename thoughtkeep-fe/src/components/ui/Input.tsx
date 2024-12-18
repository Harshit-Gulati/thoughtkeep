import { useState } from "react";
import { EyeSlashIcon } from "../../icons/EyeSlashIcon";
import { EyeIcon } from "../../icons/EyeIcon";

interface InputProps {
  placeholder: string;
  reference?: any;
  type?: string | "text";
}

export const Input = (props: InputProps) => {
  const [isVisible, setIsVisible] = useState("password");
  function toggleVisibility() {
    if (isVisible === "text") {
      setIsVisible("password");
    } else {
      setIsVisible("text");
    }
  }
  return (
    <div className="flex justify-center items-center">
      <input
        type={props.type === "password" ? isVisible : props.type}
        className="px-4 py-2 bg-[#1F2937] outline-none border border-gray-400 focus:border-purple-700 rounded-lg my-2 box-border text-white w-full text-lg"
        ref={props.reference}
        placeholder={props.placeholder}
      />
      {props.type === "password" && (
        <button className="ml-2" onClick={toggleVisibility}>
          {isVisible === "text" ? <EyeSlashIcon /> : <EyeIcon />}
        </button>
      )}
    </div>
  );
};
