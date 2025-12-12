interface TabButtonProps {
  isActive: boolean;
  onClick: () => void;
  label: string;
}

export default function TabButton({
  isActive,
  onClick,
  label,
}: TabButtonProps) {
  return (
    <button
      className={`font-semibold border-b-2 transition-colors duration-200 ${
        isActive
          ? "text-black border-black"
          : "text-gray-400 hover:text-black border-transparent"
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
