# Project Overview & Architecture

Welcome to the **React Mega Project** – a modern, full-stack blogging platform built with React and Appwrite. This document outlines what the project is, how its architecture is designed, and everything you can do with it.

---

## 🚀 What is this project?
This project is a fully-featured, production-ready blogging platform. It allows users to create accounts, set up rich public profiles, and publish blog posts using a Rich Text Editor. It handles complex state management, secure routing, database operations, and file storage seamlessly by utilizing **Appwrite** as its Backend-as-a-Service (BaaS).

---

## 🏗️ Architecture Design
The application follows a modular, component-driven architecture with a clear separation of concerns.

1. **Frontend Layer (UI):** Built with React (Vite) and styled with Tailwind CSS for a responsive, modern aesthetic.
2. **State Management Layer:** Uses Redux Toolkit to maintain a global source of truth (e.g., user authentication state, profile data).
3. **Routing Layer:** Uses React Router DOM to handle client-side routing, including protected routes (AuthLayout) that restrict access based on login status.
4. **Service Layer (Backend Interaction):** A dedicated set of classes that abstract away all direct interactions with the Appwrite SDK. This ensures that components don't need to know *how* data is fetched, just *what* data to request.

---

## 🧩 Components, Pages, and Services

### 1. Services (`/src/appwriteServices`)
Services act as the bridge between the React frontend and the Appwrite backend.
* **`auth.js`**: Handles user authentication (Login, Signup, Logout, Session validation).
* **`dbServices.js`**: Handles everything related to blog posts. It performs CRUD operations (Create, Read, Update, Delete) on the `articles` database collection, and manages featured image uploads in the Appwrite storage bucket.
* **`profileService.js`**: Manages the custom `profiles` database collection. It fetches and updates public user profiles (display name, bio, social links), handles avatar image uploads, and computes user achievements based on their post history.

### 2. Global Store (`/src/store`)
* **`authSlice.js`**: The Redux slice responsible for tracking if a user is logged in (`status`), their raw Appwrite account data (`userData`), and their customized public profile document (`profile`).

### 3. Pages (`/src/pages`)
Pages represent the main route views of the application.
* **`Home.jsx`**: The landing page displaying the latest active posts.
* **`Login.jsx` & `Signup.jsx`**: Authentication pages.
* **`AllPost.jsx`**: A grid layout displaying all available posts in the platform.
* **`AddPost.jsx` & `EditPost.jsx`**: Pages that wrap the `PostForm` component to create or modify content.
* **`Post.jsx`**: The detailed view for a single blog post. Parses HTML content safely.
* **`UserProfile.jsx`**: The public-facing profile page for any author. Displays their bio, social links, achievements/badges, and a list of all posts written by them.
* **`ProfileSettings.jsx`**: A private dashboard for logged-in users to update their profile information, upload a custom avatar, and add social media links.

### 4. Core Components (`/src/components`)
* **Layout & Wrapper**: `Header`, `Footer`, `Container` (for consistent width/padding), and `AuthLayout` (a Higher-Order Component that redirects unauthorized users away from protected pages).
* **UI Elements**: Reusable `Button`, `Input`, `Select`, and `PostCard`.
* **Forms**: `PostForm` (powered by React Hook Form) handles complex validation for post creation/editing.
* **Specialized**:
  * `RTE.jsx`: A Rich Text Editor utilizing TipTap for formatting blog post content.
  * `AvatarDropdown.jsx`: A clickable profile menu in the header for quick navigation.
  * `SocialLinksEditor.jsx`: A dynamic list editor for adding URLs to platforms like GitHub, Twitter, and LinkedIn.
  * `AchievementBadge.jsx`: A visual component that calculates and displays gamified badges (e.g., "Prolific Writer") based on a user's stats.

---

## 🔄 How Everything Interacts

1. **App Initialization:** When the app loads (`App.jsx`), it calls `authService.getCurrentUser()`. If a user exists, it saves them to Redux and immediately calls `profileService.getProfile()` to fetch their custom avatar and bio, storing that in Redux too.
2. **User Navigation:** The user clicks a link. React Router checks `AuthLayout.jsx`. If the route is protected (like `/add-post`) and the user isn't logged in, they are bounced to the login page.
3. **Data Fetching:** A user visits `/all-posts`. The `AllPost` page component mounts and fires a `useEffect`. It calls `dbServices.getAllPosts()`. The service queries the Appwrite database and returns an array of documents. The component maps over this array and renders a `PostCard` for each one.
4. **Submitting Forms:** A user edits their profile on `ProfileSettings.jsx`. They type their new bio and click Save. The component takes the React Hook Form data, passes it to `profileService.saveProfile()`, which runs an `upsertDocument` request to Appwrite. Upon success, the component dispatches an action to Redux to update the global `profile` state, causing the `Header` and `AvatarDropdown` components to instantly re-render with the new data.

---

## ✨ Features & Capabilities

Here is everything you can currently do with this project:

### Authentication & Security
* Create an account using Email/Password.
* Secure login and logout flows.
* Protected routing (guests cannot view settings or create posts; logged-in users cannot view the login page).

### User Profiles & Customization
* Upload custom avatar images.
* Set a custom Display Name (overriding the initial signup name).
* Write a personal Bio.
* Add external Social Links (X/Twitter, LinkedIn, GitHub, etc.) with custom UI icons.
* View public profiles of other authors, seeing their stats and written posts.
* Earn gamified **Achievement Badges** automatically based on the number of posts published (e.g., Novice, Author, Prolific).

### Blogging Engine
* Create blog posts using a sophisticated **Rich Text Editor**.
* Upload and manage Featured Images for posts.
* Set post status to "Active" or "Inactive" (Drafts).
* Edit existing posts seamlessly.
* Delete posts and automatically clean up associated featured images from the storage bucket.
* Read posts with perfectly formatted HTML content rendering.

---

## 🛠️ Developer Tooling
* **Vite**: Ultra-fast hot module replacement and building.
* **React Hook Form**: Performant, minimal-re-render form state management and validation.
* **Tailwind CSS**: Utility-first styling allowing for rapid UI iteration without leaving the JSX.
* **JSON Serialization**: Profile service handles complex data types (like Social Links JSON objects) automatically before interacting with the NoSQL database.
