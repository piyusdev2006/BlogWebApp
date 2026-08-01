import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import authService from "../appwriteServices/auth";
import profileService from "../appwriteServices/profileService";
import { setProfile } from "../store/authSlice";
import SocialLinksEditor from "../components/SocialLinksEditor";
import Container from "../components/container/Container";

const SECTION = { PROFILE: "profile", SOCIALS: "socials", ACCOUNT: "account" };

function ProfileSettings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const profile = useSelector((state) => state.auth.profile);

  const [activeSection, setActiveSection] = useState(SECTION.PROFILE);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // ── Profile fields ─────────────────────────────────────────────────────────
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

  // ── Avatar ─────────────────────────────────────────────────────────────────
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const fileInputRef = useRef(null);

  // ── Socials ────────────────────────────────────────────────────────────────
  const [socials, setSocials] = useState({});

  // Hydrate fields from Redux on mount
  useEffect(() => {
    setName(profile?.displayName || userData?.name || "");
    setUsername(profile?.username ?? "");
    setBio(profile?.bio ?? "");
    setSocials(profile?.socials ?? {});
    if (profile?.avatarFileId) {
      setAvatarPreview(profileService.getAvatarUrl(profile.avatarFileId));
    }
  }, [userData, profile]);

  const notify = (msg, isError = false) => {
    if (isError) setError(msg); else setSuccess(msg);
    setTimeout(() => { setSuccess(""); setError(""); }, 3500);
  };

  // ── Avatar handling ─────────────────────────────────────────────────────────
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  // ── Save handlers ──────────────────────────────────────────────────────────
  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // 1. Upload new avatar if selected
      let avatarFileId = profile?.avatarFileId ?? null;
      if (avatarFile) {
        try {
          if (avatarFileId) await profileService.deleteAvatar(avatarFileId);
        } catch (_) { /* old file may already be gone */ }
        avatarFileId = await profileService.uploadAvatar(avatarFile);
      }

      // 2. We skip updating the Appwrite User Object name to avoid mismatches
      // Just save everything to the profile collection document

      // 3. Save profile to DB
      const updatedProfile = await profileService.saveProfile(userData.$id, {
        ...profile,
        displayName: name.trim(),
        username: username.trim(),
        bio: bio.trim(),
        avatarFileId,
      });

      // Strip Appwrite's toString method to avoid Redux serialization warnings
      delete updatedProfile.toString;
      dispatch(setProfile(updatedProfile));
      notify("Profile saved ✓");
      setAvatarFile(null);
    } catch (err) {
      console.error("saveProfile error:", err);
      notify(err.message ?? "Failed to save. Please try again.", true);
    } finally {
      setSaving(false);
    }
  };

  const saveSocials = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updatedProfile = await profileService.saveProfile(userData.$id, {
        ...profile,
        socials,
      });
      // Strip toString from Appwrite document
      delete updatedProfile.toString;
      dispatch(setProfile(updatedProfile));
      notify("Social links saved ✓");
    } catch (err) {
      console.error("saveSocials error:", err);
      notify(err.message ?? "Failed to save social links.", true);
    } finally {
      setSaving(false);
    }
  };

  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);

  const handleResendVerification = async () => {
    setVerifyingEmail(true);
    try {
      const redirectUrl = `${window.location.origin}/verify-email`;
      await authService.sendVerification(redirectUrl);
      notify("Verification email sent! Please check your inbox and spam folder.");
    } catch (err) {
      console.error("Resend verification error:", err);
      notify(err?.message || "Failed to send verification email. Ensure domain is authorized in Appwrite console.", true);
    } finally {
      setVerifyingEmail(false);
    }
  };

  const handleSendResetPassword = async () => {
    if (!userData?.email) return;
    setSendingReset(true);
    try {
      const redirectUrl = `${window.location.origin}/reset-password`;
      await authService.sendPasswordRecovery(userData.email, redirectUrl);
      notify("Password reset email sent! Please check your inbox and spam folder.");
    } catch (err) {
      console.error("Send password recovery error:", err);
      notify(err?.message || "Failed to send password reset link.", true);
    } finally {
      setSendingReset(false);
    }
  };

  const displayName = profile?.displayName || userData?.name || userData?.email?.split("@")[0] || "User";
  const initials = displayName.slice(0, 2).toUpperCase();
  const isAdmin = profile?.role === "admin";

  return (
    <div className="min-h-screen bg-canvas py-12">
      <Container>
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-heading-2 font-bold text-ink mb-1">Profile Settings</h1>
            <p className="text-body-sm text-ink-subtle">Manage your public identity and social links</p>
          </div>

          {/* Toast */}
          {(success || error) && (
            <div className={`mb-6 px-4 py-3 rounded-lg border text-body-sm font-medium ${
              error
                ? "bg-semantic-error/10 border-semantic-error/30 text-semantic-error"
                : "bg-semantic-success/10 border-semantic-success/30 text-semantic-success"
            }`}>
              {success || error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar nav */}
            <nav className="md:col-span-1 flex md:flex-col gap-1">
              {[
                { key: SECTION.PROFILE, label: "Profile", icon: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 3a4 4 0 100 8 4 4 0 000-8z" },
                { key: SECTION.SOCIALS, label: "Socials", icon: "M21 2H3v16h5v4l4-4h5l4-4V2zM11 11V7M16 11V7" },
                { key: SECTION.ACCOUNT, label: "Account", icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
              ].map(({ key, label, icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveSection(key)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-body-sm font-medium transition-all cursor-pointer text-left ${
                    activeSection === key
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-ink-subtle hover:text-ink hover:bg-surface-1"
                  }`}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d={icon} />
                  </svg>
                  {label}
                </button>
              ))}
            </nav>

            {/* Main content area */}
            <div className="md:col-span-3 bg-surface-1 border border-hairline rounded-2xl p-6 md:p-8">

              {activeSection === SECTION.PROFILE && (
                <form onSubmit={saveProfile} className="space-y-6 animate-fade-in">
                  
                  {/* Avatar Upload */}
                  <div>
                    <label className="block text-body-sm font-medium text-ink mb-3">Profile Picture</label>
                    <div className="flex items-center gap-5">
                      <div className="relative group">
                        {avatarPreview ? (
                          <img src={avatarPreview} alt="Avatar" className="w-20 h-20 rounded-full object-cover ring-1 ring-hairline-strong shadow-sm" />
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-2xl">
                            {initials}
                          </div>
                        )}
                        {/* Hover overlay */}
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute inset-0 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                        </button>
                      </div>
                      <div className="flex flex-col items-start gap-1">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-lg text-button font-medium bg-surface-2 border border-hairline hover:bg-surface-3 transition-colors cursor-pointer text-ink"
                        >
                          Change picture
                        </button>
                        <p className="text-caption text-ink-subtle">JPG, PNG max 2MB</p>
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleAvatarChange}
                        accept="image/png, image/jpeg, image/jpg"
                        className="hidden"
                      />
                    </div>
                  </div>

                  <hr className="border-hairline" />

                  {/* Text inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-body-sm font-medium text-ink mb-1.5">Display Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-canvas border border-hairline text-ink focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all text-body-sm"
                        placeholder="e.g. John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-body-sm font-medium text-ink mb-1.5">Username</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-tertiary select-none">@</span>
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="w-full pl-8 pr-3 py-2 rounded-lg bg-canvas border border-hairline text-ink focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all text-body-sm"
                          placeholder="johndoe"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-body-sm font-medium text-ink mb-1.5">Bio</label>
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-canvas border border-hairline text-ink focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all text-body-sm resize-y min-h-[80px]"
                        placeholder="A short bio about yourself..."
                        maxLength={300}
                      />
                      <p className="text-right text-caption text-ink-tertiary mt-1">{bio.length}/300</p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-5 py-2.5 rounded-lg text-button font-medium text-on-primary bg-primary hover:bg-primary-hover active:bg-primary-focus transition-all shadow-md shadow-primary/20 disabled:opacity-70 cursor-pointer"
                    >
                      {saving ? "Saving..." : "Save Profile"}
                    </button>
                  </div>
                </form>
              )}


              {activeSection === SECTION.SOCIALS && (
                <form onSubmit={saveSocials} className="space-y-6 animate-fade-in">
                  <div>
                    <h2 className="text-body font-semibold text-ink mb-1">Social Profiles</h2>
                    <p className="text-body-sm text-ink-subtle mb-4">Add links to your social accounts. These will appear on your public profile.</p>
                  </div>
                  
                  <SocialLinksEditor value={socials} onChange={setSocials} />

                  <div className="pt-4 border-t border-hairline">
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-5 py-2.5 rounded-lg text-button font-medium text-on-primary bg-primary hover:bg-primary-hover active:bg-primary-focus transition-all shadow-md shadow-primary/20 disabled:opacity-70 cursor-pointer"
                    >
                      {saving ? "Saving..." : "Save Socials"}
                    </button>
                  </div>
                </form>
              )}


              {activeSection === SECTION.ACCOUNT && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h2 className="text-body font-semibold text-ink mb-1">Account Details</h2>
                    <p className="text-body-sm text-ink-subtle mb-4">Your core Appwrite account details and security options.</p>
                  </div>

                  <div className="p-4 rounded-xl border border-hairline bg-canvas space-y-4">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <span className="text-body-sm text-ink-subtle">Email Address</span>
                      <div className="flex items-center gap-2">
                        <span className="text-body-sm font-medium text-ink">{userData?.email}</span>
                        {userData?.emailVerification ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-semantic-success/10 border border-semantic-success/20 text-semantic-success text-[11px] font-semibold">
                            ✓ Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-semibold">
                            ⚠️ Unverified
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-body-sm text-ink-subtle">User ID</span>
                      <span className="text-body-sm font-mono text-ink-tertiary bg-surface-2 px-2 py-0.5 rounded">{userData?.$id}</span>
                    </div>

                    {isAdmin && (
                      <div className="flex justify-between items-center">
                        <span className="text-body-sm text-ink-subtle">Role</span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-semibold">
                          🛡️ Admin
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions for Email Verification & Password Reset */}
                  <div className="pt-4 border-t border-hairline space-y-4">
                    <h3 className="text-body-sm font-semibold text-ink">Account Actions</h3>

                    {!userData?.emailVerification && (
                      <div className="flex items-center justify-between p-4 rounded-xl border border-hairline bg-canvas flex-wrap gap-3">
                        <div>
                          <p className="text-body-sm font-medium text-ink">Verify your email address</p>
                          <p className="text-caption text-ink-subtle">Confirm your email to secure your account and access features.</p>
                        </div>
                        <button
                          type="button"
                          onClick={handleResendVerification}
                          disabled={verifyingEmail}
                          className="px-4 py-2 rounded-lg text-button font-medium bg-primary text-on-primary hover:bg-primary-hover transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          {verifyingEmail ? "Sending..." : "Resend Verification Email"}
                        </button>
                      </div>
                    )}

                    <div className="flex items-center justify-between p-4 rounded-xl border border-hairline bg-canvas flex-wrap gap-3">
                      <div>
                        <p className="text-body-sm font-medium text-ink">Reset account password</p>
                        <p className="text-caption text-ink-subtle">We will send a password recovery link to {userData?.email}.</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleSendResetPassword}
                        disabled={sendingReset}
                        className="px-4 py-2 rounded-lg text-button font-medium bg-surface-2 text-ink border border-hairline hover:bg-surface-3 transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        {sendingReset ? "Sending..." : "Send Reset Link"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default ProfileSettings;
