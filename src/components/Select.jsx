import React, { useId } from 'react'

function Select({
    label,
    options, 
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
      <select
        {...props}
        id={id}
        ref={ref}
        className="w-full px-3 py-2.5 rounded-md bg-surface-1 text-ink border border-hairline outline-none transition-all duration-200 focus:border-primary/50 focus:shadow-focus-ring text-body font-body cursor-pointer appearance-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M3 4.5L6 7.5L9 4.5' stroke='%238a8f98' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' fill='none'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 12px center",
          paddingRight: "36px",
        }}
      >
        {options?.map((option) => (
          <option key={option} value={option} className="bg-surface-1 text-ink">
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Select
