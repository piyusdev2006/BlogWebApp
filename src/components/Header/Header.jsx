import React, { useState, useEffect } from "react";
import { Container, Logo, LogoutBtn, SearchModal } from "../index.js";
import { Link, useNavigate } from "react-router";
import { useSelector } from "react-redux";

function Header() {
  const authStatus = useSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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
      name: "All Posts",
      slug: "/all-posts",
      active: authStatus,
    },
    {
      name: "Add Post",
      slug: "/add-posts",
      active: authStatus,
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-canvas/80 backdrop-blur-xl border-b border-hairline">
        <Container>
          <nav className="flex items-center justify-between h-14 gap-4">
            {/* Logo — left */}
            <div className="flex-shrink-0">
              <Link to="/" className="block">
                <Logo width="120px" />
              </Link>
            </div>

            {/* Search Trigger Button — Center/Left */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-md bg-surface-1 border border-hairline text-ink-subtle hover:text-ink hover:bg-surface-2 transition-all duration-200 cursor-pointer w-48 sm:w-64"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span className="text-body-sm flex-1 text-left truncate">Search docs...</span>
              <kbd className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-2 border border-hairline text-ink-tertiary">
                Ctrl K
              </kbd>
            </button>

            {/* Desktop nav links */}
            <ul className="hidden md:flex items-center gap-1">
              {navItems.map((item) =>
                item.active ? (
                  <li key={item.name}>
                    <button
                      onClick={() => navigate(item.slug)}
                      className="px-3 py-1.5 rounded-md text-body-sm text-ink-subtle font-medium transition-colors duration-200 hover:text-ink hover:bg-surface-1 cursor-pointer"
                    >
                      {item.name}
                    </button>
                  </li>
                ) : null
              )}
            </ul>

            {/* Header Right: Social Icons + Auth */}
            <div className="hidden md:flex items-center gap-3">
              {/* Social links like ChaiDocs */}
              <div className="flex items-center gap-2 pr-2 border-r border-hairline text-ink-tertiary">
                <a href="https://github.com" target="_blank" rel="noreferrer" className="p-1.5 rounded-md hover:text-ink hover:bg-surface-1 transition-colors" aria-label="GitHub">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                  </svg>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="p-1.5 rounded-md hover:text-red-400 hover:bg-surface-1 transition-colors" aria-label="YouTube">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>

              {!authStatus ? (
                <>
                  <button
                    onClick={() => navigate("/login")}
                    className="px-[14px] py-[8px] rounded-md text-button font-medium text-ink bg-surface-1 border border-hairline transition-all duration-200 hover:bg-surface-2 hover:border-hairline-strong cursor-pointer"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => navigate("/signup")}
                    className="px-[14px] py-[8px] rounded-md text-button font-medium text-on-primary bg-primary transition-all duration-200 hover:bg-primary-hover active:bg-primary-focus cursor-pointer"
                  >
                    Get Started
                  </button>
                </>
              ) : (
                <LogoutBtn />
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-md text-ink-subtle hover:text-ink hover:bg-surface-1 transition-colors cursor-pointer"
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
            <div className="md:hidden border-t border-hairline py-3 animate-fade-in space-y-2">
              <ul className="flex flex-col gap-1">
                {navItems.map((item) =>
                  item.active ? (
                    <li key={item.name}>
                      <button
                        onClick={() => {
                          navigate(item.slug);
                          setMobileOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-md text-body-sm text-ink-subtle font-medium transition-colors duration-200 hover:text-ink hover:bg-surface-1 cursor-pointer"
                      >
                        {item.name}
                      </button>
                    </li>
                  ) : null
                )}
              </ul>
              <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-hairline">
                {!authStatus ? (
                  <>
                    <button
                      onClick={() => {
                        navigate("/login");
                        setMobileOpen(false);
                      }}
                      className="w-full px-[14px] py-[8px] rounded-md text-button font-medium text-ink bg-surface-1 border border-hairline transition-all duration-200 hover:bg-surface-2 cursor-pointer"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => {
                        navigate("/signup");
                        setMobileOpen(false);
                      }}
                      className="w-full px-[14px] py-[8px] rounded-md text-button font-medium text-on-primary bg-primary transition-all duration-200 hover:bg-primary-hover cursor-pointer"
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
