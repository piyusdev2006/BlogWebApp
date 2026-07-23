import React, { useState, useEffect } from 'react'
import { PostCard, Container } from '../components';
import dbService from '../appwriteServices/dbServices'

function AllPost() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)

  useEffect(() => {
      dbService
        .getAllPosts([])
        .then((posts) => {
          if (posts) {
            setPosts(posts.documents);
          }
        })
        .catch((error) => console.log(error))
        .finally(() => setLoading(false));
  }, [])

    
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="w-full py-12 page-enter">
      <Container>
        {/* Page header */}
        <div className="mb-8">
          <p className="text-eyebrow text-primary uppercase tracking-widest mb-2">
            Browse
          </p>
          <h1 className="text-display-md text-ink font-display">
            All Posts
          </h1>
        </div>

        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 rounded-xl bg-surface-1 border border-hairline flex items-center justify-center mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8a8f98" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
            </div>
            <h3 className="text-card-title text-ink font-display mb-2">No posts yet</h3>
            <p className="text-body-sm text-ink-subtle">Start by creating your first post.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
            {posts.map((post) => (
              <PostCard key={post.$id} {...post} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}

export default AllPost
