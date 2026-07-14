import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'

export default function Protected({ children, authentication = true })
{
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const authStatus = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    //TODO: make it more easy to understand

    // if (authStatus ===true){
    //     navigate("/")
    // } else if (authStatus === false) {
    //     navigate("/login")
    // }

    //let authValue = authStatus === true ? true : false

    if (authentication && authStatus !== authentication) {
      navigate("/login");
    } else if (!authentication && authStatus !== authentication) {
      navigate("/");
    }

    setLoader(false);
  }, [authStatus, navigate, authentication]);

  /*
     *  Isko AUR Aasan Kaise Banayein? (Code Clean Up)
     * useEffect(() => {
  Scenario 1: Agar login zaroori hai, aur user logged in NAHI hai
  if (authentication === true && authStatus === false) {
    navigate("/login");
  } 
   Scenario 2: Agar login mana hai (like Login page), aur user PEHLE SE logged in hai
  else if (authentication === false && authStatus === true) {
    navigate("/");
  }

    Check khatam, ab loading band karo aur page dikhao!
    setLoader(false);
}, [authStatus, navigate, authentication]);

*/

  return loader ? <h1>Loading...</h1> : <>{children}</>;
}




/*
 * AuthLayout.jsx
 * This component serves as a layout wrapper for authentication pages.
 * It's a mechanism to protect routes and pages that require user authentication.
 * It can be used to wrap around login, signup, and other auth-related components.
 * Hum check krte hai kii hume children ko render karna hai ya nahi based on authentication status.
 * In this example, it simply renders the children passed to it.
 * You can enhance this component to include authentication checks and redirects as needed.
 */