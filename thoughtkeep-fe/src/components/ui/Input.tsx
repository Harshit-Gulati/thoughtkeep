interface InputProps {
  placeholder: string;
  reference?: any;
}

export const Input = (props: InputProps) => {
  return (
    <div>
      <input
        type="text"
        className="px-4 py-2 bg-[#1F2937] outline-none border border-gray-400 focus:border-purple-700 rounded-lg my-2 box-border text-white w-full text-lg"
        ref={props.reference}
        placeholder={props.placeholder}
      />
    </div>
  );
};
