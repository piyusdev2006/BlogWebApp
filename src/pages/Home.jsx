import React, { useState, useEffect } from 'react'
import dbService from '../appwriteServices/dbServices'
import { Container, PostCard } from '../components';
import { Link } from 'react-router';
import { useSelector } from 'react-redux';

function Home() {
    const [posts, setPosts] = useState([])
    const authStatus = useSelector((state) => state.auth.isLoggedIn);

    useEffect(() => {
        dbService.getAllPosts()
            .then((posts) => {
                if (posts) setPosts(posts.documents);
            });
    }, []);

    return (
      <div className="w-full page-enter">
        {/* ChaiDocs style Hero section */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-surface-1/40 to-canvas border-b border-hairline">
          <Container>
            <div className="max-w-3xl mx-auto text-center space-y-6">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2 border border-hairline text-caption font-mono text-primary">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Navi Docs — Documentation Platform
              </div>

              {/* Hero headline */}
              <h1 className="text-display-md md:text-display-lg text-ink font-display tracking-tight">
                Docs You’ll <span className="text-primary">Actually Read.</span>
              </h1>

              {/* Sub-headline */}
              <p className="text-body-lg text-ink-muted max-w-2xl mx-auto leading-relaxed">
                Level up your technical knowledge with structured, clear documentation.
                Whether you’re getting started or mastering advanced topics, get all the information in one place.
              </p>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <Link
                  to={posts.length > 0 ? `/post/${posts[0].$id}` : "/all-posts"}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md text-button font-medium text-on-primary bg-primary transition-all duration-200 hover:bg-primary-hover active:bg-primary-focus shadow-lg shadow-primary/25"
                >
                  Start Reading Docs
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </Link>
                
                <Link
                  to="/all-posts"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md text-button font-medium text-ink bg-surface-1 border border-hairline transition-all duration-200 hover:bg-surface-2 hover:border-hairline-strong"
                >
                  Browse All Documentation
                </Link>
              </div>
            </div>

            {/* Quick Series Grid */}
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  title: "Web Development",
                  count: "HTML, CSS & JS",
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5e6ad2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
                    </svg>
                  ),
                  desc: "Core web standards, Emmet shortcuts, and HTML5 tags.",
                },
                {
                  title: "Git & Version Control",
                  count: "Branches & Workflow",
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5e6ad2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>
                    </svg>
                  ),
                  desc: "Git internals, branching strategies, stashing, and tags.",
                },
                {
                  title: "Backend & SQL",
                  count: "APIs & Databases",
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5e6ad2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
                    </svg>
                  ),
                  desc: "Database design, PostgreSQL, SQL joins, and backend APIs.",
                },
                {
                  title: "DevOps & Cloud",
                  count: "Nginx, Docker & VPS",
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5e6ad2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>
                    </svg>
                  ),
                  desc: "VPS setup, Nginx rate limits, SSL certificates, and Docker.",
                },
              ].map((item) => (
                <Link
                  key={item.title}
                  to="/all-posts"
                  className="bg-surface-1 rounded-lg border border-hairline p-5 transition-all duration-300 hover:bg-surface-2 hover:border-hairline-strong hover:-translate-y-0.5 group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-md bg-surface-2 border border-hairline">{item.icon}</div>
                    <span className="text-caption font-mono text-ink-tertiary">{item.count}</span>
                  </div>
                  <h3 className="text-card-title text-ink font-display mb-1 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-body-sm text-ink-subtle">{item.desc}</p>
                </Link>
              ))}
            </div>
          </Container>
        </section>

        {/* Recent Articles Grid Section */}
        <section className="py-16">
          <Container>
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-eyebrow text-primary uppercase tracking-widest mb-1">
                  Documentation Library
                </p>
                <h2 className="text-display-md text-ink font-display">
                  Featured Documentation
                </h2>
              </div>
              <Link
                to="/all-posts"
                className="hidden sm:inline-flex items-center gap-1.5 text-body-sm font-medium text-primary hover:text-primary-hover transition-colors"
              >
                View all docs →
              </Link>
            </div>

            {posts.length === 0 ? (
              <div className="text-center py-16 bg-surface-1 rounded-lg border border-hairline">
                <p className="text-body-lg text-ink-muted mb-4">No documentation published yet.</p>
                {authStatus && (
                  <Link
                    to="/add-posts"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-button font-medium text-on-primary bg-primary hover:bg-primary-hover transition-all"
                  >
                    Publish First Doc
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
                {posts.map((post) => (
                  <PostCard key={post.$id} {...post} />
                ))}
              </div>
            )}
          </Container>
        </section>

        {/* ChaiDocs style Community & Contribution Banner */}
        <section className="py-16 border-t border-hairline bg-surface-1/30">
          <Container>
            <div className="bg-surface-1 rounded-xl border border-hairline p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-3 text-center md:text-left">
                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-caption font-mono text-primary">
                  Community & Contribution
                </span>
                <h2 className="text-headline text-ink font-display">
                  Have a question or want to get involved?
                </h2>
                <p className="text-body-sm text-ink-subtle max-w-xl">
                  Navi Docs is built for developers by developers. Join our community on Discord, contribute code on GitHub, or ask questions to get help.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="https://discord.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md text-button font-medium text-on-primary bg-primary hover:bg-primary-hover transition-all cursor-pointer"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                  Join Discord
                </a>

                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md text-button font-medium text-ink bg-surface-2 border border-hairline hover:border-hairline-strong transition-all cursor-pointer"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                  </svg>
                  Contribute
                </a>
              </div>
            </div>
          </Container>
        </section>
      </div>
    );
}

export default Home
