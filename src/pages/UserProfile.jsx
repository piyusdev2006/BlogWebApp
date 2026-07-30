import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useSelector } from "react-redux";
import profileService from "../appwriteServices/profileService";
import AchievementBadge, { BADGE_META } from "../components/AchievementBadge";
import PostCard from "../components/PostCard";
import Container from "../components/container/Container";
import { PLATFORM_ICONS } from "../components/SocialLinksEditor";

function UserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.userData);
  const currentProfile = useSelector((state) => state.auth.profile);

  // Is this the logged-in user's own profile?
  const isOwnProfile = currentUser?.$id === userId;

  const [profileData, setProfileData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({ badges: [], postCount: 0, totalWords: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        if (isOwnProfile && currentProfile) {
          setProfileData(currentProfile);
        } else {
          // Fetch from DB
          const data = await profileService.getProfile(userId);
          setProfileData(data || { displayName: "Author", socials: {} });
        }

        const userPosts = await profileService.getPostsByUser(userId);
        setPosts(userPosts);
        setStats(profileService.computeAchievements(userPosts));
      } catch (err) {
        console.error("UserProfile load error", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [userId, isOwnProfile, currentProfile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="loading-spinner" />
          <span className="text-body-sm text-ink-subtle animate-pulse-soft">Loading profile…</span>
        </div>
      </div>
    );
  }

  const displayName = profileData?.displayName || "Author";
  const initials = displayName.slice(0, 2).toUpperCase();
  const avatarUrl = profileData?.avatarFileId
    ? profileService.getAvatarUrl(profileData.avatarFileId)
    : null;
  const isAdmin = profileData?.role === "admin";
  const activeSocials = Object.entries(profileData?.socials ?? {}).filter(([, url]) => url?.trim());

  // We no longer have $createdAt easily available for other users unless we add it to the profile doc.
  // We'll skip Joined date for now or we could pull it from the profile if we start saving it.

  const allBadgeKeys = Object.keys(BADGE_META);

  return (
    <div className="min-h-screen bg-canvas">
      {/* Hero / profile header */}
      <div className="border-b border-hairline bg-surface-1">
        <Container>
          <div className="py-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Avatar */}
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-24 h-24 rounded-full object-cover ring-2 ring-hairline-strong shadow-xl flex-shrink-0"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center text-primary font-bold text-3xl flex-shrink-0 shadow-xl">
                  {initials}
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-heading-2 font-bold text-ink">{displayName}</h1>
                  {isAdmin && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-semibold">
                      🛡️ Admin
                    </span>
                  )}
                </div>

                {profileData?.username && (
                  <p className="text-body-sm text-ink-tertiary mb-2">@{profileData.username}</p>
                )}

                {profileData?.bio && (
                  <p className="text-body-sm text-ink-subtle max-w-xl mb-3">{profileData.bio}</p>
                )}

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-4 text-caption text-ink-tertiary">
                  <span className="flex items-center gap-1.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    {stats.postCount} post{stats.postCount !== 1 ? "s" : ""}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="17" y1="10" x2="3" y2="10" />
                      <line x1="21" y1="6" x2="3" y2="6" />
                      <line x1="21" y1="14" x2="3" y2="14" />
                      <line x1="17" y1="18" x2="3" y2="18" />
                    </svg>
                    {stats.totalWords.toLocaleString()} words
                  </span>
                </div>

                {/* Social icons */}
                {activeSocials.length > 0 && (
                  <div className="flex items-center gap-2 mt-3">
                    {activeSocials.map(([platform, url]) => (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={platform}
                        className="p-1.5 rounded-md text-ink-tertiary hover:text-ink hover:bg-surface-2 border border-transparent hover:border-hairline transition-all"
                      >
                        {PLATFORM_ICONS[platform] ?? PLATFORM_ICONS.website}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Edit button for own profile */}
              {isOwnProfile && (
                <Link
                  to="/profile/settings"
                  className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-button font-medium text-ink-subtle bg-surface-2 border border-hairline hover:text-ink hover:border-hairline-strong transition-all"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Edit Profile
                </Link>
              )}
            </div>
          </div>
        </Container>
      </div>

      <Container>
        <div className="py-10 space-y-10">

          {/* Stats bar */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Posts Published", value: stats.postCount },
              { label: "Words Written", value: stats.totalWords.toLocaleString() },
              { label: "Achievements", value: stats.badges.length },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl border border-hairline bg-surface-1 p-4 text-center">
                <p className="text-heading-2 font-bold text-ink">{value}</p>
                <p className="text-caption text-ink-tertiary mt-1">{label}</p>
              </div>
            ))}
          </div>

          {/* Achievements */}
          <section>
            <h2 className="text-body font-semibold text-ink mb-4">Achievements</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
              {allBadgeKeys.map((key) => (
                <AchievementBadge key={key} badgeKey={key} earned={stats.badges.includes(key)} />
              ))}
            </div>
          </section>

          {/* Posts */}
          <section>
            <h2 className="text-body font-semibold text-ink mb-4">
              {isOwnProfile ? "Your Posts" : `Posts by ${displayName}`}
            </h2>
            {posts.length === 0 ? (
              <div className="rounded-xl border border-hairline bg-surface-1 py-16 text-center">
                <p className="text-ink-subtle text-body-sm">
                  {isOwnProfile ? "You haven't published any posts yet." : "No published posts yet."}
                </p>
                {isOwnProfile && (
                  <Link to="/add-posts" className="mt-3 inline-block text-primary text-body-sm font-medium hover:underline">
                    Write your first post →
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {posts.map((post) => (
                  <PostCard key={post.$id} {...post} />
                ))}
              </div>
            )}
          </section>
        </div>
      </Container>
    </div>
  );
}

export default UserProfile;
