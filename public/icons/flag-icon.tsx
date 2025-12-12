const FlagIcon = ({ className = "" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className={className}
    >
      <path
        d="M3.33301 11.666V17.4993"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.79767 3.1991C7.04331 1.77488 4.41383 2.83108 3.33301 3.68353V12.3545C4.14109 11.426 6.56533 9.98675 9.79767 11.6581C12.6863 13.1518 15.5033 12.3313 16.6663 11.686V3.34011C14.4243 4.35967 12.0141 4.34516 9.79767 3.1991Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default FlagIcon;
