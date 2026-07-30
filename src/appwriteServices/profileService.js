import config from "../config/config.js";
import { Client, Databases, Storage, Query, ID, Permission, Role } from "appwrite";

/**
 * profileService
 * ──────────────
 * All profile operations use the "profiles" **database collection**
 * instead of account.prefs (which fails CORS on Appwrite v1.9.x).
 *
 * Document ID = userId (so we can fetch any user's profile directly).
 * `socials` field is stored as a JSON string.
 */
class ProfileService {
  client = new Client();
  databases;
  bucket;

  constructor() {
    this.client
      .setEndpoint(config.appwriteUrl)
      .setProject(config.appwriteProjectId);
    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

  // ── Profile CRUD ──────────────────────────────────────────────────────────

  /**
   * Get a user's profile document. Returns null if not found.
   * Works for ANY userId (public profiles).
   */
  async getProfile(userId) {
    if (!config.appwriteProfilesCollectionId) {
      return null;
    }
    try {
      const doc = await this.databases.getDocument(
        config.appwriteDatabaseId,
        config.appwriteProfilesCollectionId,
        userId
      );
      const parsed = {
        ...doc,
        socials: doc.socials ? JSON.parse(doc.socials) : {},
      };
      delete parsed.toString;
      return parsed;
    } catch (error) {
      // 404 = profile doesn't exist yet — that's OK
      if (error?.code === 404) return null;
      console.log("ProfileService :: getProfile :: error", error);
      return null;
    }
  }

  /**
   * Create or update the logged-in user's profile.
   * Uses upsertDocument so it works whether the doc exists or not.
   */
  async saveProfile(userId, { displayName, username, bio, avatarFileId, role, socials }) {
    if (!config.appwriteProfilesCollectionId) {
      throw new Error("Profiles collection ID is not configured. Please set VITE_APPWRITE_PROFILES_COLLECTION_ID in your environment settings.");
    }
    try {
      const data = {
        userId,
        displayName: displayName ?? "",
        username: username ?? "",
        bio: bio ?? "",
        avatarFileId: avatarFileId ?? "",
        role: role ?? "",
        socials: JSON.stringify(socials ?? {}),
      };

      const doc = await this.databases.upsertDocument(
        config.appwriteDatabaseId,
        config.appwriteProfilesCollectionId,
        userId,          // documentId = userId
        data,
        [
          Permission.read(Role.any()),           // anyone can read this profile
          Permission.update(Role.user(userId)),   // only owner can update
          Permission.delete(Role.user(userId)),   // only owner can delete
        ]
      );

      const parsed = {
        ...doc,
        socials: doc.socials ? JSON.parse(doc.socials) : {},
      };
      delete parsed.toString;
      return parsed;
    } catch (error) {
      console.log("ProfileService :: saveProfile :: error", error);
      throw error;
    }
  }

  // ── Posts (for public profile page) ───────────────────────────────────────

  /**
   * Get all ACTIVE posts belonging to a specific userId.
   */
  async getPostsByUser(userId) {
    try {
      const response = await this.databases.listDocuments(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        [Query.equal("userId", userId), Query.equal("status", "active")]
      );
      return response.documents ?? [];
    } catch (error) {
      console.log("ProfileService :: getPostsByUser :: error", error);
      return [];
    }
  }

  // ── Avatar ────────────────────────────────────────────────────────────────

  async uploadAvatar(file) {
    try {
      const uploaded = await this.bucket.createFile(
        config.appwriteBucketId,
        ID.unique(),
        file,
        [Permission.read(Role.any())]
      );
      return uploaded.$id;
    } catch (error) {
      console.log("ProfileService :: uploadAvatar :: error", error);
      throw error;
    }
  }

  async deleteAvatar(fileId) {
    try {
      await this.bucket.deleteFile(config.appwriteBucketId, fileId);
      return true;
    } catch (error) {
      console.log("ProfileService :: deleteAvatar :: error", error);
      return false;
    }
  }

  getAvatarUrl(fileId) {
    if (!fileId) return null;
    return String(this.bucket.getFileView(config.appwriteBucketId, fileId));
  }

  // ── Achievements ──────────────────────────────────────────────────────────

  computeAchievements(posts = []) {
    const postCount = posts.length;
    const totalWords = posts.reduce((acc, post) => {
      const text = (post.content ?? "").replace(/<[^>]*>/g, " ");
      return acc + text.split(/\s+/).filter(Boolean).length;
    }, 0);

    const badges = [];
    if (postCount >= 1)  badges.push("first_word");
    if (postCount >= 5)  badges.push("storyteller");
    if (postCount >= 10) badges.push("prolific");
    if (postCount >= 25) badges.push("legend");
    if (totalWords >= 1_000)  badges.push("words_1k");
    if (totalWords >= 10_000) badges.push("words_10k");
    if (totalWords >= 50_000) badges.push("words_50k");

    return { badges, postCount, totalWords };
  }
}

const profileService = new ProfileService();
export default profileService;
