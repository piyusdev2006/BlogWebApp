import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import dbService from "../appwriteServices/dbServices";

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      dbService
        .getAllPosts([])
        .then((res) => {
          if (res) setPosts(res.documents);
        })
        .finally(() => setLoading(false));

      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const filteredPosts = posts.filter((post) =>
    post.title?.toLowerCase().includes(query.toLowerCase()) ||
    post.content?.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredPosts.length || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev === 0 ? (filteredPosts.length - 1 < 0 ? 0 : filteredPosts.length - 1) : prev - 1
      );
    } else if (e.key === "Enter" && filteredPosts[selectedIndex]) {
      e.preventDefault();
      handleSelect(filteredPosts[selectedIndex].$id);
    }
  };

  const handleSelect = (id) => {
    navigate(`/post/${id}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-canvas/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-surface-1 rounded-xl border border-hairline shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center px-4 py-3 border-b border-hairline gap-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8a8f98" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search documentation, articles, topics..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-ink text-body font-body outline-none placeholder:text-ink-tertiary"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-mono text-ink-tertiary bg-surface-2 border border-hairline rounded">
            ESC
          </kbd>
        </div>

        {/* Search Results */}
        <div className="max-h-[360px] overflow-y-auto p-2">
          {loading ? (
            <div className="py-10 text-center">
              <div className="loading-spinner mx-auto mb-2" />
              <p className="text-body-sm text-ink-subtle">Searching docs...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-body-sm text-ink-subtle">No docs found matching "{query}"</p>
            </div>
          ) : (
            <ul className="space-y-1">
              {filteredPosts.map((post, idx) => (
                <li
                  key={post.$id}
                  onClick={() => handleSelect(post.$id)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                    idx === selectedIndex ? "bg-surface-2 text-ink border border-hairline-strong" : "text-ink-subtle hover:bg-surface-2/50"
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5e6ad2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    <span className="text-body-sm font-medium truncate">{post.title}</span>
                  </div>
                  <span className="text-caption text-ink-tertiary font-mono flex-shrink-0">
                    Jump to →
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-hairline bg-surface-2/50 flex items-center justify-between text-caption text-ink-tertiary">
          <div className="flex items-center gap-2">
            <span><kbd className="px-1.5 py-0.5 bg-surface-1 border border-hairline rounded">↑</kbd> <kbd className="px-1.5 py-0.5 bg-surface-1 border border-hairline rounded">↓</kbd> to navigate</span>
            <span><kbd className="px-1.5 py-0.5 bg-surface-1 border border-hairline rounded">↵</kbd> to select</span>
          </div>
          <span>Navi Docs Search</span>
        </div>
      </div>
    </div>
  );
}
