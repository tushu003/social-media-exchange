interface AddSectionButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export default function AddSectionButton({
  onClick,
  disabled,
}: AddSectionButtonProps) {
  return (
    <div>
      <button
        onClick={onClick}
        disabled={disabled}
        className={`text-white text-sm px-4 mb-6 py-2 rounded-full 
                 ease-in-out duration-300 cursor-pointer
                 ${
                   disabled
                     ? "bg-gray-400 cursor-not-allowed"
                     : "bg-[#20B894] hover:bg-[#198d70]"
                 }`}
      >
        Add Section
      </button>
    </div>
  );
}
