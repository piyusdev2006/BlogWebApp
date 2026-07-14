import React from 'react'
import { useDispatch } from 'react-redux';
import authServices from '../../appwriteServices/auth.js';
import { logout } from '../../store/authSlice.js';
import { useNavigate } from 'react-router';

function LogoutBtn() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const logoutHandler = () => { 
    authServices.logout()
      .then(() => { 
        dispatch(logout())
        navigate('/login')
      })
  }
  return (
    <button
      onClick={logoutHandler}
      className="inline-block px-6 py-2 duration-200 hover:bg-blue-100 rounded-full">Logout</button>
  )
}

export default LogoutBtn
