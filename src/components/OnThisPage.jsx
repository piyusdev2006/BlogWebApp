import React, { useEffect, useState } from "react";

export default function OnThisPage({ contentHtml }) {
  const [headings, setHeadings] = useState([]);
  const [activeHeading, setActiveHeading] = useState("");

  useEffect(() => {
    if (!contentHtml) return;

    // Parse HTML string to extract headings
    const parser = new DOMParser();
    const doc = parser.parseFromString(contentHtml, "text/html");
    const headingElements = Array.from(doc.querySelectorAll("h1, h2, h3"));

    const items = headingElements.map((el, index) => {
      const text = el.textContent.trim();
      const id = el.id || `heading-${index}-${text.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
      const level = el.tagName.toLowerCase();
      return { id, text, level };
    });

    setHeadings(items);

    // Update actual DOM elements in rendered container to have matching IDs for jump scroll
    setTimeout(() => {
      const renderedHeadings = document.querySelectorAll(".prose-content h1, .prose-content h2, .prose-content h3");
      renderedHeadings.forEach((el, index) => {
        if (items[index]) {
          el.id = items[index].id;
        }
      });
    }, 100);
  }, [contentHtml]);

  const scrollToHeading = (id) => {
    const target = document.getElementById(id);
    if (target) {
      const yOffset = -80; // Offset for sticky header
      const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveHeading(id);
    }
  };

  if (headings.length === 0) return null;

  return (
    <aside className="w-56 flex-shrink-0 hidden xl:block">
      <div className="sticky top-20 pl-4 border-l border-hairline space-y-3">
        <p className="text-eyebrow text-ink-muted uppercase tracking-wider font-semibold">
          On This Page
        </p>
        <ul className="space-y-2 text-caption">
          {headings.map((item) => (
            <li key={item.id} style={{ paddingLeft: item.level === "h3" ? "12px" : item.level === "h2" ? "4px" : "0" }}>
              <button
                onClick={() => scrollToHeading(item.id)}
                className={`text-left w-full transition-colors cursor-pointer line-clamp-1 ${
                  activeHeading === item.id
                    ? "text-primary font-medium"
                    : "text-ink-tertiary hover:text-ink-subtle"
                }`}
              >
                {item.text}
              </button>
            </li>
          ))}
        </ul>

        {/* Scroll to Top Link */}
        <div className="pt-3 border-t border-hairline">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-1.5 text-caption text-ink-tertiary hover:text-ink transition-colors cursor-pointer"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="18 15 12 9 6 15"/>
            </svg>
            Back to top
          </button>
        </div>
      </div>
    </aside>
  );
}
