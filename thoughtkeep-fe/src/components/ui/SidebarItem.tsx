import { ReactElement } from "react";

export const SidebarItem = ({
  icon,
  text,
  onClick,
  activeColor,
}: {
  icon?: ReactElement;
  text: string;
  onClick: () => void;
  activeColor: boolean;
}) => {
  return (
    <div
      className={`flex justify-center items-center py-4 my-2 cursor-pointer hover:text-purple-500 transition-all w-full ${
        activeColor ? `text-purple-500` : `text-white`
      }`}
      onClick={onClick}
    >
      <span>{icon}</span>
      <span className="text-xl ml-4 flex items-center">{text}</span>
    </div>
  );
};
