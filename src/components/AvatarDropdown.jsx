import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import authService from "../appwriteServices/auth";
import { logout } from "../store/authSlice";
import profileService from "../appwriteServices/profileService";

/**
 * AvatarDropdown
 * ─────────────
 * Small dropdown menu shown when the user clicks their avatar/name pill in the header.
 * Closes on outside click or Escape key.
 *
 * Props:
 *   onClose – called when the dropdown should close
 */
function AvatarDropdown({ onClose }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);
  const profile = useSelector((state) => state.auth.profile);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleLogout = async () => {
    await authService.logout();
    dispatch(logout());
    onClose();
    navigate("/");
  };

  const go = (path) => { navigate(path); onClose(); };

  const displayName = profile?.displayName || userData?.name || userData?.email?.split("@")[0] || "User";
  const initials = displayName.slice(0, 2).toUpperCase();
  const avatarUrl = profile?.avatarFileId
    ? profileService.getAvatarUrl(profile.avatarFileId)
    : null;

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-surface-1 border border-hairline shadow-xl shadow-black/30 overflow-hidden z-50 animate-fade-in"
    >
      {/* User identity row */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-hairline bg-surface-2">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-9 h-9 rounded-full object-cover ring-1 ring-hairline-strong"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
            {initials}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-body-sm font-semibold text-ink truncate">{displayName}</p>
          {profile?.username && (
            <p className="text-caption text-ink-tertiary truncate">@{profile.username}</p>
          )}
        </div>
      </div>

      {/* Menu items */}
      <div className="py-1.5">
        <button
          onClick={() => go(`/profile/${userData?.$id}`)}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-body-sm text-ink-subtle hover:text-ink hover:bg-surface-2 transition-colors cursor-pointer text-left"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          My Profile
        </button>

        <button
          onClick={() => go("/profile/settings")}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-body-sm text-ink-subtle hover:text-ink hover:bg-surface-2 transition-colors cursor-pointer text-left"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
          </svg>
          Settings
        </button>

        <button
          onClick={() => go("/add-posts")}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-body-sm text-ink-subtle hover:text-ink hover:bg-surface-2 transition-colors cursor-pointer text-left"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Post
        </button>
      </div>

      {/* Logout */}
      <div className="border-t border-hairline py-1.5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-body-sm text-semantic-error hover:bg-semantic-error/10 transition-colors cursor-pointer text-left"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default AvatarDropdown;
