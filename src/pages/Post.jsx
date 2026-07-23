import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import dbService from "../appwriteServices/dbServices";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
  const [post, setPost] = useState(null);
  const { slug } = useParams();
  const navigate = useNavigate();

  const userData = useSelector((state) => state.auth.userData);

  const isAuthor = post && userData ? (post.userId === userData.$id || !post.userId) : false;

  useEffect(() => {
    if (slug) {
      dbService.getPost(slug).then((post) => {
        if (post) setPost(post);
        else navigate("/");
      });
    } else navigate("/");
  }, [slug, navigate]);

  const deletePost = () => {
    dbService.deletePost(post.$id).then((status) => {
      if (status) {
        dbService.deleteFile(post.featuredImage);
        navigate("/");
      }
    });
  };

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="py-10 md:py-16 page-enter">
      <Container>
        <article className="max-w-4xl mx-auto">
          {/* Featured image */}
          {post.featuredImage && (
            <div className="relative mb-8 bg-surface-1 rounded-xl border border-hairline overflow-hidden">
              <img
                src={dbService.getFileView(post.featuredImage)}
                alt={post.title}
                className="w-full h-auto object-cover"
              />

              {/* Author action buttons */}
              {isAuthor && (
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <Link to={`/edit-post/${post.$id}`}>
                    <Button variant="secondary" className="backdrop-blur-sm bg-surface-1/80">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                      </svg>
                      Edit
                    </Button>
                  </Link>
                  <Button variant="danger" onClick={deletePost} className="backdrop-blur-sm">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                    Delete
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Title */}
          <div className="mb-8">
            <h1 className="text-display-md md:text-display-lg text-ink font-display mb-4">
              {post.title}
            </h1>
            <div className="h-px bg-hairline" />
          </div>

          {/* Content */}
          <div className="prose-content">{parse(post.content)}</div>
        </article>
      </Container>
    </div>
  );
}
