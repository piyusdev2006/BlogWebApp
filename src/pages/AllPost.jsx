import React, { useState, useEffect } from 'react'
import { PostCard, Container } from '../components';
import dbService from '../appwriteServices/dbServices'
import { Link } from 'react-router';

function AllPost() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [activeCategory, setActiveCategory] = useState('All')

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

  const categories = ["All", "Web Dev", "Git & GitHub", "Backend & SQL", "DevOps & Cloud"];

  // Filter posts based on category and search query
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content?.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeCategory === "All") return matchesSearch;
    return matchesSearch;
  });

  return (
    <div className="w-full py-10 md:py-16 page-enter">
      <Container>
        {/* Page header */}
        <div className="mb-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2 border border-hairline text-caption font-mono text-primary">
            <span className="w-2 h-2 rounded-full bg-primary" />
            Knowledge Base — {posts.length} Documentations
          </div>
          <h1 className="text-display-md md:text-display-lg text-ink font-display tracking-tight">
            Documentation Library
          </h1>
          <p className="text-body-lg text-ink-muted leading-relaxed">
            Explore guides, reference docs, and tutorials across web development, system architecture, database design, and cloud infrastructure.
          </p>
        </div>

        {/* Filter bar & Search */}
        <div className="mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-2 bg-surface-1 rounded-xl border border-hairline">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-body-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                  activeCategory === cat
                    ? "bg-primary text-on-primary shadow-md shadow-primary/20"
                    : "text-ink-subtle hover:text-ink hover:bg-surface-2"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#8a8f98"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute left-3 top-1/2 -translate-y-1/2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Filter docs by keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-surface-2 border border-hairline rounded-lg text-body-sm text-ink placeholder:text-ink-tertiary outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>

        {/* Loading state skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-surface-1 rounded-xl border border-hairline p-5 space-y-4">
                <div className="aspect-[16/9] rounded-lg skeleton" />
                <div className="h-6 w-3/4 rounded skeleton" />
                <div className="h-4 w-full rounded skeleton" />
                <div className="h-4 w-2/3 rounded skeleton" />
              </div>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-surface-1 rounded-xl border border-hairline text-center px-4">
            <div className="w-16 h-16 rounded-2xl bg-surface-2 border border-hairline flex items-center justify-center mb-4 text-primary">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            </div>
            <h3 className="text-card-title text-ink font-display mb-2">No documents found</h3>
            <p className="text-body-sm text-ink-subtle max-w-sm mb-6">
              {searchQuery ? `No documents match "${searchQuery}". Try a different term or clear the filter.` : "No documentation has been published yet."}
            </p>
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 rounded-md text-button font-medium text-ink bg-surface-2 border border-hairline hover:bg-surface-3 transition-all cursor-pointer"
              >
                Clear Filter
              </button>
            ) : (
              <Link
                to="/add-posts"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-button font-medium text-on-primary bg-primary hover:bg-primary-hover transition-all"
              >
                Publish New Doc
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
            {filteredPosts.map((post) => (
              <PostCard key={post.$id} {...post} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}

export default AllPost;

