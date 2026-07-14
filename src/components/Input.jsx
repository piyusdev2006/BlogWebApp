import React, { useId } from 'react'


// const Input = forwardRef(function Input({
//     label,
//     type = "text",
//     className = "",
//     ...props

// }, ref) {
//     const id = useId();
//     return (
//       <div className='w-full'>
//             {
//                 label &&
//                 <label className = "mb-2 font-semibold" htmlFor={props.id}>
//                     {label}
//                 </label>
//             }
//             <input
//                 type={type}
//                 className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
//                 ref={ref}
//                 {...props}
//                 id = {id}
//             />
//       </div>
//     );
// })

// export default Input



// in recact 19 no forwardRef is required for input component to work with react-hook-form.

// code the above in react 19 without forwardRef and useId.

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
          <label className="inline-block mb-1 pl-1" htmlFor={id}>
            {label}
          </label>
        )}
        <input
          type={type}
          className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full ${className}`}
          ref={ref}
          {...props}
          id={id}
        />
      </div>
    );
}

export default Input