import { useNavigate } from "react-router-dom";
import { BrainIcon } from "../../icons/BrainIcon";

const defaultStyles =
  "font-semibold text-white tracking-tighter flex justify-center items-center cursor-pointer";

const variantStyles = {
  dash: "text-xl  w-fit ",
  land: "text-2xl ",
  side: "text-2xl pt-4 ",
  sign: "text-4xl pt-4 mb-6 ",
};

export const Logo = (props: { style: "dash" | "side" | "sign" | "land" }) => {
  const navigate = useNavigate();
  return (
    <span
      className={variantStyles[props.style] + defaultStyles}
      onClick={() => {
        navigate("/");
      }}
    >
      <span className="mr-2">
        <BrainIcon />
      </span>
      Thought<span className="text-purple-500">Keep</span>
    </span>
  );
};
