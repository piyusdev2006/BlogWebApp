import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import dbService from "../appwriteServices/dbServices";
import { Button, Container, DocsSidebar, OnThisPage, DocFooterNav } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
  const [post, setPost] = useState(null);
  const [allPosts, setAllPosts] = useState([]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { slug } = useParams();
  const navigate = useNavigate();

  const userData = useSelector((state) => state.auth.userData);
  const isAuthor = post && userData ? (post.userId === userData.$id || !post.userId) : false;

  // Track window scroll progress for article reading progress bar
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (slug) {
      dbService.getPost(slug).then((postData) => {
        if (postData) setPost(postData);
        else navigate("/");
      });
    } else navigate("/");

    // Fetch all posts for sidebar and prev/next nav
    dbService.getAllPosts([]).then((res) => {
      if (res) setAllPosts(res.documents);
    });
  }, [slug, navigate]);

  // Enhance code blocks with copy buttons after render
  useEffect(() => {
    if (!post) return;
    const timer = setTimeout(() => {
      const pres = document.querySelectorAll(".prose-content pre");
      pres.forEach((pre) => {
        if (pre.querySelector(".copy-code-btn")) return;
        pre.style.position = "relative";
        const btn = document.createElement("button");
        btn.className = "copy-code-btn absolute top-3 right-3 px-2.5 py-1 text-[11px] font-mono rounded bg-surface-2/90 text-ink-subtle hover:text-ink border border-hairline transition-colors cursor-pointer backdrop-blur-md";
        btn.innerText = "Copy";
        btn.onclick = () => {
          const codeText = pre.querySelector("code")?.innerText || pre.innerText;
          navigator.clipboard.writeText(codeText);
          btn.innerText = "Copied! ✓";
          btn.classList.add("text-primary", "border-primary/40");
          setTimeout(() => {
            btn.innerText = "Copy";
            btn.classList.remove("text-primary", "border-primary/40");
          }, 2000);
        };
        pre.appendChild(btn);
      });
    }, 150);
    return () => clearTimeout(timer);
  }, [post]);

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="loading-spinner" />
        <span className="text-body-sm text-ink-subtle">Loading document...</span>
      </div>
    );
  }

  // Calculate reading time & prev/next posts
  const wordCount = post.content ? post.content.replace(/<[^>]+>/g, "").split(/\s+/).length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const currentIndex = allPosts.findIndex((p) => p.$id === post.$id);
  const previousPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex >= 0 && currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  const handleDelete = () => {
    dbService.deletePost(post.$id).then((status) => {
      if (status) {
        if (post.featuredImage) {
          dbService.deleteFile(post.featuredImage);
        }
        navigate("/");
      }
    });
  };

  return (
    <div className="py-8 md:py-12 page-enter relative">
      {/* Top Reading Progress Bar */}
      <div
        className="fixed top-14 left-0 right-0 h-0.5 bg-primary z-50 transition-all duration-150 shadow-sm shadow-primary/50"
        style={{ width: `${scrollProgress}%` }}
      />

      <Container>
        <div className="flex gap-8 justify-between items-start">
          {/* Left Sidebar — Categories & Docs Nav */}
          <DocsSidebar posts={allPosts} activeId={post.$id} />

          {/* Main Article Content */}
          <main className="flex-1 max-w-3xl min-w-0">
            <article>
              {/* Featured image */}
              {post.featuredImage && (
                <div className="relative mb-8 bg-surface-1 rounded-xl border border-hairline overflow-hidden shadow-xl">
                  <img
                    src={dbService.getFileView(post.featuredImage)}
                    alt={post.title}
                    className="w-full h-auto object-cover max-h-[420px]"
                    onError={(e) => {
                      e.currentTarget.parentElement.style.display = "none";
                    }}
                  />

                  {/* Author action buttons */}
                  {isAuthor && (
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                      <Link to={`/edit-post/${post.$id}`}>
                        <Button variant="secondary" className="backdrop-blur-md bg-surface-1/90 border-hairline">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 20h9M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                          </svg>
                          Edit
                        </Button>
                      </Link>
                      <Button variant="danger" onClick={() => setShowDeleteConfirm(true)} className="backdrop-blur-md">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Title & Metadata */}
              <div className="mb-8 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3 text-caption text-ink-subtle">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-2 border border-hairline text-primary font-mono text-[12px]">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                      </svg>
                      {readingTime} min read
                    </span>
                    <span>•</span>
                    <span className="font-mono text-ink-tertiary">
                      Updated {new Date(post.$updatedAt || post.$createdAt || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>

                  {/* Top Author edit trigger if no image */}
                  {isAuthor && !post.featuredImage && (
                    <div className="flex items-center gap-2">
                      <Link to={`/edit-post/${post.$id}`}>
                        <Button variant="secondary" className="text-caption py-1 px-3">
                          Edit Doc
                        </Button>
                      </Link>
                      <Button variant="danger" onClick={() => setShowDeleteConfirm(true)} className="text-caption py-1 px-3">
                        Delete
                      </Button>
                    </div>
                  )}
                </div>

                <h1 className="text-display-md md:text-display-lg text-ink font-display tracking-tight leading-tight">
                  {post.title}
                </h1>
                <div className="h-px bg-gradient-to-r from-hairline via-hairline-strong to-hairline" />
              </div>

              {/* Content body */}
              <div className="prose-content">{parse(post.content)}</div>

              {/* Previous / Next Doc Footer Navigation */}
              <DocFooterNav previousPost={previousPost} nextPost={nextPost} />
            </article>
          </main>

          {/* Right Sidebar — On This Page TOC */}
          <OnThisPage contentHtml={post.content} />
        </div>
      </Container>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-canvas/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-surface-1 rounded-xl border border-hairline p-6 space-y-4 shadow-2xl">
            <h3 className="text-card-title font-display text-ink">Delete this document?</h3>
            <p className="text-body-sm text-ink-subtle">
              Are you sure you want to delete "<span className="text-ink font-medium">{post.title}</span>"? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Confirm Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

