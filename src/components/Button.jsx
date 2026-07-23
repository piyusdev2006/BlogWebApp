import React from 'react'

function Button({
    children,
    type = "button",
    variant = "primary",
    className = "",
    ...props
}) {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 px-[14px] py-[8px] rounded-md font-body text-button font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

  const variants = {
    primary:
      "bg-primary text-on-primary hover:bg-primary-hover active:bg-primary-focus",
    secondary:
      "bg-surface-1 text-ink border border-hairline hover:bg-surface-2 hover:border-hairline-strong active:bg-surface-3",
    tertiary:
      "bg-transparent text-ink hover:bg-surface-1 active:bg-surface-2",
    danger:
      "bg-red-600/10 text-red-400 border border-red-600/20 hover:bg-red-600/20 hover:border-red-600/30 active:bg-red-600/30",
    inverse:
      "bg-inverse-canvas text-inverse-ink hover:bg-inverse-surface-1 active:bg-inverse-surface-2",
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button