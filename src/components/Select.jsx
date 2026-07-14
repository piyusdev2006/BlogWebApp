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
      {label && <label className="mb-2 font-semibold" htmlFor={id}></label>}
      <select
        {...props}
        id={id}
        ref={ref}
        className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full ${className}`}>
        {options?.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Select
