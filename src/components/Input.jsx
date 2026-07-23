import React, { useId } from 'react'

function Input({
    label, 
    type = "text",
    className = "",
    ref,
    ...props
}) {
  const id = useId();

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          className="inline-block mb-1.5 pl-0.5 text-body-sm text-ink-muted font-medium"
          htmlFor={id}
        >
          {label}
        </label>
      )}
      <input
        type={type}
        className="w-full px-3 py-2.5 rounded-md bg-surface-1 text-ink border border-hairline placeholder:text-ink-tertiary outline-none transition-all duration-200 focus:border-primary/50 focus:shadow-focus-ring text-body font-body"
        ref={ref}
        {...props}
        id={id}
      />
    </div>
  );
}

export default Input