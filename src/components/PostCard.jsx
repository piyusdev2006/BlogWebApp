import React from "react";
import dbService from "../appwriteServices/dbServices";
import { Link } from "react-router";

function PostCard({ $id, title, featuredImage }) {
  return (
    <Link to={`/post/${$id}`} className="block group">
      <article className="bg-surface-1 rounded-lg border border-hairline overflow-hidden transition-all duration-300 hover:bg-surface-2 hover:border-hairline-strong hover:-translate-y-0.5">
        {/* Image container */}
        <div className="aspect-[16/10] overflow-hidden bg-surface-2">
          {featuredImage && (
            <img
              src={dbService.getFileView(featuredImage)}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h2 className="text-card-title text-ink font-display line-clamp-2 group-hover:text-primary transition-colors duration-200">
            {title}
          </h2>
        </div>
      </article>
    </Link>
  );
}

export default PostCard;
