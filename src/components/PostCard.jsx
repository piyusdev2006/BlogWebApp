import React from "react";
import dbService from "../appwriteServices/dbServices";
import { Link } from "react-router";

function PostCard({ $id, title, featuredImage, content, category = "Documentation", $createdAt }) {
  // Calculate read time if content exists
  const wordCount = content ? content.replace(/<[^>]+>/g, "").split(/\s+/).length : 120;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const formattedDate = $createdAt
    ? new Date($createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : null;

  return (
    <Link to={`/post/${$id}`} className="block group">
      <article className="h-full flex flex-col bg-surface-1 rounded-xl border border-hairline overflow-hidden transition-all duration-300 hover:bg-surface-2 hover:border-hairline-strong hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5">
        {/* Image container / Fallback banner */}
        <div className="relative aspect-[16/9] overflow-hidden bg-surface-2 flex items-center justify-center">
          {featuredImage ? (
            <img
              src={dbService.getFileView(featuredImage)}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                // If image load fails, hide image element and show fallback parent styling
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-surface-2 via-surface-1 to-primary/10 flex items-center justify-center p-6 text-center border-b border-hairline">
              <div className="flex flex-col items-center gap-2 text-ink-tertiary group-hover:text-primary transition-colors">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
                <span className="text-caption font-mono uppercase tracking-wider">Navi Doc</span>
              </div>
            </div>
          )}

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-surface-1/90 backdrop-blur-md border border-hairline text-primary shadow-sm">
              {category}
            </span>
          </div>

          <div className="absolute bottom-3 right-3">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-canvas/80 backdrop-blur-md text-ink-subtle border border-hairline">
              {readingTime} min read
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div>
            <h2 className="text-card-title text-ink font-display line-clamp-2 group-hover:text-primary transition-colors duration-200 leading-snug">
              {title}
            </h2>
            {content && (
              <p className="mt-2 text-body-sm text-ink-subtle line-clamp-2 leading-relaxed">
                {content.replace(/<[^>]+>/g, "")}
              </p>
            )}
          </div>

          <div className="pt-3 border-t border-hairline flex items-center justify-between text-caption text-ink-tertiary">
            <span>{formattedDate || "Updated recently"}</span>
            <span className="flex items-center gap-1 text-primary group-hover:translate-x-1 transition-transform font-medium">
              Read Doc →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default PostCard;

