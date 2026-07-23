import React, { useState } from "react";
import { Container, Logo, LogoutBtn } from "../index.js";
import { Link, useNavigate } from "react-router";
import { useSelector } from "react-redux";


function Header() {
  const authStatus = useSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    {
      name: "Home",
      slug: "/",
      active: true,
    },
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
    },
    {
      name: "Signup",
      slug: "/signup",
      active: !authStatus,
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
    <header className="sticky top-0 z-50 bg-canvas/80 backdrop-blur-xl border-b border-hairline">
      <Container>
        <nav className="flex items-center justify-between h-14">
          {/* Logo — left */}
          <div className="flex-shrink-0">
            <Link to="/" className="block">
              <Logo width="120px" />
            </Link>
          </div>

          {/* Desktop nav — center */}
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

          {/* Desktop auth buttons — right */}
          <div className="hidden md:flex items-center gap-2">
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
          <div className="md:hidden border-t border-hairline py-3 animate-fade-in">
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
  );
}

export default Header;
