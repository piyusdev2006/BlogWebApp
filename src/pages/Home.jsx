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

    if (posts.length === 0) {
        return (
          <div className="w-full page-enter">
            {/* Hero section */}
            <section className="py-24 md:py-32 lg:py-40">
              <Container>
                <div className="max-w-3xl mx-auto text-center">
                  {/* Eyebrow */}
                  <p className="text-eyebrow text-primary uppercase tracking-widest mb-6">
                    Welcome to Navi Docs
                  </p>

                  {/* Hero headline */}
                  <h1 className="text-display-md md:text-display-lg text-ink font-display mb-6">
                    Read. Write.{" "}
                    <span className="text-primary">Share.</span>
                  </h1>

                  {/* Sub-headline */}
                  <p className="text-body-lg text-ink-muted max-w-xl mx-auto mb-10">
                    A premium blogging platform crafted for readers and writers who
                    appreciate beautiful, thoughtful design.
                  </p>

                  {/* CTA buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    {!authStatus ? (
                      <>
                        <Link
                          to="/signup"
                          className="inline-flex items-center justify-center px-6 py-3 rounded-md text-button font-medium text-on-primary bg-primary transition-all duration-200 hover:bg-primary-hover active:bg-primary-focus"
                        >
                          Get Started — It's Free
                        </Link>
                        <Link
                          to="/login"
                          className="inline-flex items-center justify-center px-6 py-3 rounded-md text-button font-medium text-ink bg-surface-1 border border-hairline transition-all duration-200 hover:bg-surface-2 hover:border-hairline-strong"
                        >
                          Sign In
                        </Link>
                      </>
                    ) : (
                      <Link
                        to="/add-posts"
                        className="inline-flex items-center justify-center px-6 py-3 rounded-md text-button font-medium text-on-primary bg-primary transition-all duration-200 hover:bg-primary-hover active:bg-primary-focus"
                      >
                        Write Your First Post
                      </Link>
                    )}
                  </div>
                </div>

                {/* Feature cards */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      icon: (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 20h9M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                        </svg>
                      ),
                      title: "Write Freely",
                      desc: "A rich text editor that gets out of your way so you can focus on what matters.",
                    },
                    {
                      icon: (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                        </svg>
                      ),
                      title: "Read Beautifully",
                      desc: "Content rendered with precision typography and careful spacing for a luxurious reading experience.",
                    },
                    {
                      icon: (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                        </svg>
                      ),
                      title: "Share Easily",
                      desc: "Publish your stories and share them with the world in just a few clicks.",
                    },
                  ].map((card) => (
                    <div
                      key={card.title}
                      className="bg-surface-1 rounded-lg border border-hairline p-6 transition-all duration-300 hover:bg-surface-2 hover:border-hairline-strong"
                    >
                      <div className="text-primary mb-4">{card.icon}</div>
                      <h3 className="text-card-title text-ink font-display mb-2">
                        {card.title}
                      </h3>
                      <p className="text-body-sm text-ink-subtle">{card.desc}</p>
                    </div>
                  ))}
                </div>
              </Container>
            </section>
          </div>
        );
    }

    return (
      <div className="w-full py-12 page-enter">
        <Container>
          {/* Section header */}
          <div className="mb-8">
            <p className="text-eyebrow text-primary uppercase tracking-widest mb-2">
              Latest Posts
            </p>
            <h2 className="text-display-md text-ink font-display">
              Fresh from the community
            </h2>
          </div>

          {/* Posts grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
            {posts.map((post) => (
              <PostCard key={post.$id} {...post} />
            ))}
          </div>
        </Container>
      </div>
    );
}

export default Home
