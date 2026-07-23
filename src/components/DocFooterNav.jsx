import React from "react";
import { Link } from "react-router";

export default function DocFooterNav({ previousPost, nextPost }) {
  if (!previousPost && !nextPost) return null;

  return (
    <nav className="mt-12 pt-8 border-t border-hairline grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Previous doc */}
      {previousPost ? (
        <Link
          to={`/post/${previousPost.$id}`}
          className="flex flex-col p-4 rounded-lg bg-surface-1 border border-hairline hover:bg-surface-2 hover:border-hairline-strong transition-all group"
        >
          <span className="text-caption text-ink-tertiary font-mono flex items-center gap-1 group-hover:text-primary transition-colors">
            ← Previous
          </span>
          <span className="text-body-sm font-medium text-ink mt-1 line-clamp-1">
            {previousPost.title}
          </span>
        </Link>
      ) : (
        <div />
      )}

      {/* Next doc */}
      {nextPost ? (
        <Link
          to={`/post/${nextPost.$id}`}
          className="flex flex-col items-end p-4 rounded-lg bg-surface-1 border border-hairline hover:bg-surface-2 hover:border-hairline-strong transition-all group text-right sm:col-start-2"
        >
          <span className="text-caption text-ink-tertiary font-mono flex items-center gap-1 group-hover:text-primary transition-colors">
            Next →
          </span>
          <span className="text-body-sm font-medium text-ink mt-1 line-clamp-1">
            {nextPost.title}
          </span>
        </Link>
      ) : null}
    </nav>
  );
}
