import React, { useState, useEffect } from "react";
import { Container, Logo, SearchModal } from "../index.js";
import { Link, useNavigate, useLocation } from "react-router";
import { useSelector } from "react-redux";
import AvatarDropdown from "../AvatarDropdown";
import profileService from "../../appwriteServices/profileService";

function Header() {
  const authStatus = useSelector((state) => state.auth.isLoggedIn);
  const userData = useSelector((state) => state.auth.userData);
  const profile = useSelector((state) => state.auth.profile);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navItems = [
    {
      name: "Home",
      slug: "/",
      active: true,
    },
    {
      name: "Docs Library",
      slug: "/all-posts",
      active: authStatus,
    },
    {
      name: "+ Create Doc",
      slug: "/add-posts",
      active: authStatus,
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-canvas/85 backdrop-blur-xl border-b border-hairline transition-all">
        <Container>
          <nav className="flex items-center justify-between h-16 gap-4">
            {/* Logo — left */}
            <div className="flex-shrink-0">
              <Link to="/" className="block hover:opacity-90 transition-opacity">
                <Logo width="130px" />
              </Link>
            </div>

            {/* Search Trigger Button — Center/Left */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-surface-1 border border-hairline text-ink-subtle hover:text-ink hover:bg-surface-2 hover:border-hairline-strong transition-all duration-200 cursor-pointer w-44 sm:w-64 md:w-80 group shadow-inner"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 group-hover:text-primary transition-colors">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span className="text-body-sm flex-1 text-left truncate">Search documentation...</span>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-2 border border-hairline text-ink-tertiary">
                <span className="text-[9px]">⌘</span>K
              </kbd>
            </button>

            {/* Desktop nav links */}
            <ul className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                if (!item.active) return null;
                const isActive = location.pathname === item.slug;
                return (
                  <li key={item.name}>
                    <button
                      onClick={() => navigate(item.slug)}
                      className={`px-3 py-1.5 rounded-lg text-body-sm font-medium transition-all duration-200 cursor-pointer ${
                        isActive
                          ? "bg-surface-2 text-primary border border-hairline-strong shadow-sm"
                          : "text-ink-subtle hover:text-ink hover:bg-surface-1"
                      }`}
                    >
                      {item.name}
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Header Right: Auth */}
            <div className="hidden md:flex items-center gap-3">

              {!authStatus ? (
                <>
                  <button
                    onClick={() => navigate("/login")}
                    className="px-3.5 py-1.5 rounded-lg text-button font-medium text-ink bg-surface-1 border border-hairline transition-all duration-200 hover:bg-surface-2 hover:border-hairline-strong cursor-pointer"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => navigate("/signup")}
                    className="px-3.5 py-1.5 rounded-lg text-button font-medium text-on-primary bg-primary transition-all duration-200 hover:bg-primary-hover active:bg-primary-focus shadow-md shadow-primary/20 cursor-pointer"
                  >
                    Get Started
                  </button>
                </>
              ) : (
                <div className="relative flex items-center gap-3">
                  {/* Avatar button */}
                  <button
                    onClick={() => setAvatarOpen((v) => !v)}
                    className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
                    aria-label="Open profile menu"
                  >
                    {profile?.avatarFileId ? (
                      <img
                        src={profileService.getAvatarUrl(profile.avatarFileId)}
                        alt="Avatar"
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-hairline-strong hover:ring-primary/40 transition-all"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-[13px] hover:bg-primary/30 transition-colors">
                        {(profile?.displayName || userData?.name || userData?.email || "U").slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ink-tertiary">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {/* Dropdown */}
                  {avatarOpen && <AvatarDropdown onClose={() => setAvatarOpen(false)} />}
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-ink-subtle hover:text-ink hover:bg-surface-1 transition-colors cursor-pointer border border-hairline"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M3 6H17M3 10H17M3 14H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              )}
            </button>
          </nav>

          {/* Mobile dropdown */}
          {mobileOpen && (
            <div className="md:hidden border-t border-hairline py-4 animate-fade-in space-y-3">
              <ul className="flex flex-col gap-1">
                {navItems.map((item) =>
                  item.active ? (
                    <li key={item.name}>
                      <button
                        onClick={() => {
                          navigate(item.slug);
                          setMobileOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-body-sm text-ink-subtle font-medium transition-colors duration-200 hover:text-ink hover:bg-surface-1 cursor-pointer"
                      >
                        {item.name}
                      </button>
                    </li>
                  ) : null
                )}
              </ul>
              <div className="flex flex-col gap-2 pt-3 border-t border-hairline">
                {!authStatus ? (
                  <>
                    <button
                      onClick={() => {
                        navigate("/login");
                        setMobileOpen(false);
                      }}
                      className="w-full px-4 py-2 rounded-lg text-button font-medium text-ink bg-surface-1 border border-hairline transition-all duration-200 hover:bg-surface-2 cursor-pointer"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => {
                        navigate("/signup");
                        setMobileOpen(false);
                      }}
                      className="w-full px-4 py-2 rounded-lg text-button font-medium text-on-primary bg-primary transition-all duration-200 hover:bg-primary-hover cursor-pointer"
                    >
                      Get Started
                    </button>
                  </>
                ) : (
                  <LogoutBtn />
                )}
              </div>
            </div>
          )}
        </Container>
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}

export default Header;



