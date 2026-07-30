import React, { useState, useEffect } from 'react'
import dbService from '../appwriteServices/dbServices'
import { Container, PostCard } from '../components';
import { Link } from 'react-router';
import { useSelector } from 'react-redux';

function Home() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('react');
    const authStatus = useSelector((state) => state.auth.isLoggedIn);

    useEffect(() => {
        dbService.getAllPosts()
            .then((posts) => {
                if (posts) setPosts(posts.documents);
            })
            .finally(() => setLoading(false));
    }, []);

    const codePreviews = {
      react: `// 1. Reactive Document Search Component
import { useState } from 'react';

export function QuickSearch({ docs }) {
  const [query, setQuery] = useState('');
  const results = docs.filter(d => 
    d.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="search-palette font-mono">
      <input 
        value={query} 
        onChange={e => setQuery(e.target.value)} 
        placeholder="Ctrl + K to search documentation..." 
      />
      <span>{results.length} docs found</span>
    </div>
  );
}`,
      backend: `// 2. Appwrite Database Query Service
import { Client, Databases, Query } from 'appwrite';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('YOUR_PROJECT_ID');

const db = new Databases(client);

export async function fetchPublishedDocs() {
  return await db.listDocuments('db_id', 'collection_id', [
    Query.equal('status', 'active'),
    Query.orderDesc('$createdAt')
  ]);
}`,
      docker: `# 3. Production Multi-Stage Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]`
    };

    return (
      <div className="w-full page-enter">
        {/* Hero section with radial glow */}
        <section className="relative py-20 md:py-32 overflow-hidden border-b border-hairline bg-gradient-to-b from-surface-1/60 via-canvas to-canvas">
          {/* Lavender background glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

          <Container>
            <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
              {/* Eyebrow badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-2/80 border border-hairline text-caption font-mono text-primary shadow-sm backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Navi Docs — Technical Documentation Engine
              </div>

              {/* Main Headline */}
              <h1 className="text-display-md sm:text-display-lg md:text-display-xl text-ink font-display tracking-tight leading-[1.08]">
                Documentation Built for <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-primary via-primary-hover to-ink bg-clip-text text-transparent">
                  Modern Engineering Teams.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-body-lg text-ink-muted max-w-2xl mx-auto leading-relaxed">
                Streamlined, dense technical guides with keyboard-first search, interactive code samples, and structured documentation pathways.
              </p>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <Link
                  to={posts.length > 0 ? `/post/${posts[0].$id}` : "/all-posts"}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-button font-medium text-on-primary bg-primary transition-all duration-200 hover:bg-primary-hover active:bg-primary-focus shadow-lg shadow-primary/20 hover:shadow-primary/30"
                >
                  Start Reading Docs
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </Link>
                
                <Link
                  to="/all-posts"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-button font-medium text-ink bg-surface-1 border border-hairline transition-all duration-200 hover:bg-surface-2 hover:border-hairline-strong"
                >
                  Explore Knowledge Base
                </Link>
              </div>
            </div>

            {/* Interactive Code Preview Window */}
            <div className="mt-14 max-w-3xl mx-auto rounded-xl border border-hairline bg-surface-1 shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-hairline bg-surface-2/60">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
                  <span className="ml-2 text-caption font-mono text-ink-tertiary">demo-preview.tsx</span>
                </div>
                <div className="flex items-center gap-1">
                  {['react', 'backend', 'docker'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-2.5 py-1 rounded text-[11px] font-mono capitalize transition-colors cursor-pointer ${
                        activeTab === tab ? "bg-surface-1 text-primary border border-hairline" : "text-ink-tertiary hover:text-ink-subtle"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
              <pre className="p-5 text-caption font-mono text-ink-muted bg-surface-1/90 overflow-x-auto leading-relaxed">
                <code>{codePreviews[activeTab]}</code>
              </pre>
            </div>

            {/* Quick Series Grid */}
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  title: "Web Development",
                  count: "HTML, CSS & JS",
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#828fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
                    </svg>
                  ),
                  desc: "Core web standards, Emmet shortcuts, and modern React patterns.",
                },
                {
                  title: "Git & Version Control",
                  count: "Branches & Workflow",
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#828fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>
                    </svg>
                  ),
                  desc: "Git internals, rebase workflow, cherry-picking, and stashing.",
                },
                {
                  title: "Backend & SQL",
                  count: "APIs & Databases",
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#828fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
                    </svg>
                  ),
                  desc: "Database design, PostgreSQL query tuning, and REST/GraphQL APIs.",
                },
                {
                  title: "DevOps & Cloud",
                  count: "Nginx, Docker & VPS",
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#828fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>
                    </svg>
                  ),
                  desc: "VPS hardening, Nginx SSL configuration, and Docker compose stacks.",
                },
              ].map((item) => (
                <Link
                  key={item.title}
                  to="/all-posts"
                  className="bg-surface-1 rounded-xl border border-hairline p-5 transition-all duration-300 hover:bg-surface-2 hover:border-hairline-strong hover:-translate-y-1 hover:shadow-lg group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-lg bg-surface-2 border border-hairline group-hover:border-primary/40 transition-colors">{item.icon}</div>
                    <span className="text-caption font-mono text-ink-tertiary">{item.count}</span>
                  </div>
                  <h3 className="text-card-title text-ink font-display mb-1.5 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-body-sm text-ink-subtle leading-relaxed">{item.desc}</p>
                </Link>
              ))}
            </div>
          </Container>
        </section>

        {/* Recent Articles Grid Section */}
        <section className="py-16 md:py-24">
          <Container>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
              <div>
                <p className="text-eyebrow text-primary uppercase tracking-widest mb-1.5 font-mono">
                  Featured Docs
                </p>
                <h2 className="text-display-md text-ink font-display tracking-tight">
                  Latest Technical Documentation
                </h2>
              </div>
              <Link
                to="/all-posts"
                className="inline-flex items-center gap-1.5 text-body-sm font-medium text-primary hover:text-primary-hover transition-colors"
              >
                View all documentation →
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="bg-surface-1 rounded-xl border border-hairline p-5 space-y-4">
                    <div className="aspect-[16/9] rounded-lg skeleton" />
                    <div className="h-6 w-3/4 rounded skeleton" />
                    <div className="h-4 w-full rounded skeleton" />
                  </div>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20 bg-surface-1 rounded-xl border border-hairline">
                <p className="text-body-lg text-ink-muted mb-4">No documentation published yet.</p>
                {authStatus && (
                  <Link
                    to="/add-posts"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-button font-medium text-on-primary bg-primary hover:bg-primary-hover transition-all"
                  >
                    Publish First Document
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
                {posts.slice(0, 6).map((post) => (
                  <PostCard key={post.$id} {...post} />
                ))}
              </div>
            )}
          </Container>
        </section>

        {/* Community & Contribution Banner */}
        <section className="py-16 border-t border-hairline bg-surface-1/30">
          <Container>
            <div className="bg-gradient-to-r from-surface-1 via-surface-2 to-surface-1 rounded-2xl border border-hairline p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
              <div className="space-y-3 text-center md:text-left">
                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-caption font-mono text-primary">
                  Open Community
                </span>
                <h2 className="text-headline text-ink font-display">
                  Have a question or want to contribute a doc?
                </h2>
                <p className="text-body-sm text-ink-subtle max-w-xl leading-relaxed">
                  Navi Docs is crafted for developers who love clean engineering. Join our community, share technical guides, or request new topic coverage.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="https://x.com/codewithpiyus"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-button font-medium text-ink bg-surface-2 border border-hairline hover:border-hairline-strong hover:bg-surface-3 transition-all cursor-pointer"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  Follow Updates
                </a>

                <a
                  href="https://github.com/piyusdev2006"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-button font-medium text-on-primary bg-primary hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all cursor-pointer"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                  </svg>
                  GitHub Repository
                </a>
              </div>
            </div>
          </Container>
        </section>
      </div>
    );
}

export default Home;

