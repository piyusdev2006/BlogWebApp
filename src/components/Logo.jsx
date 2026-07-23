import React from "react";

function Logo({ width = "auto" }) {
  return (
    <div className="flex items-center gap-2.5" style={{ width }}>
      {/* Lavender docs emblem */}
      <svg
        viewBox="0 0 28 28"
        fill="none"
        className="w-7 h-7 flex-shrink-0"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="28" height="28" rx="6" fill="#5e6ad2" />
        <path
          d="M8.5 6.5C8.5 5.94772 8.94772 5.5 9.5 5.5H15.0858C15.351 5.5 15.6054 5.60536 15.7929 5.79289L19.2071 9.20711C19.3946 9.39464 19.5 9.649 19.5 9.91421V21.5C19.5 22.0523 19.0523 22.5 18.5 22.5H9.5C8.94772 22.5 8.5 22.0523 8.5 21.5V6.5Z"
          fill="#ffffff"
          fillOpacity="0.15"
          stroke="#ffffff"
          strokeWidth="1.5"
        />
        <path
          d="M14.5 5.5V9.5H18.5"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11.5 13.5H16.5M11.5 16.5H14.5"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      <span className="font-display font-semibold text-ink text-[17px] tracking-tight whitespace-nowrap">
        Navi Docs
      </span>
    </div>
  );
}

export default Logo;
