import React from "react";
import dbService from "../appwriteServices/dbServices";
import { Link } from "react-router";

function PostCard({ $id, title, featuredImage }) {
  return (
    <Link to={`/post/${$id}`}>
      <div className="w-full bg-gray-100 rounded-xl p-4">
        <div className="w-full flex justify-center mb-4">
          {featuredImage && (
            <img
              src={dbService.getFileView(featuredImage)}
              alt={title}
              className="rounded-xl"
            />
          )}
        </div>
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
    </Link>
  );
}

export default PostCard;
