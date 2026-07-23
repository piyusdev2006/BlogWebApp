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
      className="inline-flex items-center gap-2 px-[14px] py-[8px] rounded-md text-button font-medium text-ink bg-surface-1 border border-hairline transition-all duration-200 hover:bg-surface-2 hover:border-hairline-strong active:bg-surface-3 cursor-pointer"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
        <path d="M6 14H3.333A1.333 1.333 0 0 1 2 12.667V3.333A1.333 1.333 0 0 1 3.333 2H6M10.667 11.333L14 8l-3.333-3.333M14 8H6" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      Logout
    </button>
  )
}

export default LogoutBtn
