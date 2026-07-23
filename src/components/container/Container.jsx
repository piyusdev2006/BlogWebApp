import React from 'react'

function Container({children}) {
  return (
    <div className='w-full max-w-content mx-auto px-4 sm:px-6 lg:px-8'>
      {children}
    </div>
  )
}

export default Container

/** 
    container property accepts krta hai as a children
    isme hum styling property define krte hai jo ki humare component ke andar content ko wrap krta hai
 */
