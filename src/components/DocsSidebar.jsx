import React, { useState } from "react";
import { Link, useLocation } from "react-router";

export default function DocsSidebar({ posts = [], activeId }) {
  const location = useLocation();
  const [openSections, setOpenSections] = useState({
    "Getting Started": true,
    "Web Development": true,
    "Backend & Databases": true,
    "DevOps & Tools": true,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Group posts into logical categories or default fallback
  const categories = [
    {
      title: "Getting Started",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
      ),
      items: posts.slice(0, 3),
    },
    {
      title: "Web Development",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
        </svg>
      ),
      items: posts.slice(3, 6),
    },
    {
      title: "Backend & Databases",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
        </svg>
      ),
      items: posts.slice(6, 9),
    },
    {
      title: "DevOps & Tools",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>
        </svg>
      ),
      items: posts.slice(9),
    },
  ];

  return (
    <aside className="w-64 flex-shrink-0 hidden lg:block">
      <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-4 space-y-6">
        {/* Navigation Quick Link */}
        <div className="pb-3 border-b border-hairline">
          <Link
            to="/all-posts"
            className="flex items-center gap-2 text-body-sm font-medium text-ink-subtle hover:text-ink transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            All Documentation
          </Link>
        </div>

        {/* Categories */}
        {categories.map((cat) => {
          const isOpen = openSections[cat.title];
          return (
            <div key={cat.title} className="space-y-1.5">
              <button
                onClick={() => toggleSection(cat.title)}
                className="w-full flex items-center justify-between py-1 text-eyebrow text-ink-muted uppercase tracking-wider font-semibold hover:text-ink transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="text-primary">{cat.icon}</span>
                  <span>{cat.title}</span>
                </div>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>

              {isOpen && (
                <ul className="pl-4 space-y-1 border-l border-hairline ml-2">
                  {cat.items.length > 0 ? (
                    cat.items.map((post) => {
                      const isActive = activeId === post.$id;
                      return (
                        <li key={post.$id}>
                          <Link
                            to={`/post/${post.$id}`}
                            className={`block py-1.5 px-2.5 rounded-md text-body-sm font-medium transition-colors ${
                              isActive
                                ? "bg-surface-2 text-primary border-l-2 border-primary"
                                : "text-ink-subtle hover:text-ink hover:bg-surface-1"
                            }`}
                          >
                            {post.title}
                          </Link>
                        </li>
                      );
                    })
                  ) : (
                    <li className="py-1 px-2 text-caption text-ink-tertiary">
                      No docs in this section
                    </li>
                  )}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
