# 🚀 CodeFolio — Developer Publishing & Portfolio Platform

A modern, high-performance developer documentation and publishing platform inspired by the sleek dark aesthetics of **Linear** and **ChaiDocs**. Built with **React 19**, **Tailwind CSS**, **TipTap Block Editor**, and **Appwrite Cloud**.

---

## 📑 Table of Contents
- [✨ Key Features](#-key-features)
- [🏗️ System Architecture](#️-system-architecture)
- [🔐 Authentication & Token Workflows](#-authentication--token-workflows)
  - [1. Email Verification Flow](#1-email-verification-flow)
  - [2. Password Reset / Recovery Flow](#2-password-reset--recovery-flow)
- [🧩 Project Structure](#-project-structure)
- [⚡ Quick Start & Setup](#-quick-start--setup)
- [🛠️ Developer Tooling](#️-developer-tooling)

---

## ✨ Key Features

- **Linear Dark Aesthetics:** Custom near-black canvas (`#010102`), surface elevation ladder, hairline borders (`#23252a`), and lavender-blue chromatic accents (`#5e6ad2`).
- **Zero-API TipTap Rich Text Editor:** 100% open-source block editor replacing cloud-bound editors—no API keys required.
- **Global Command Search (`Ctrl + K`):** Instant search modal dialog with real-time text filtering and keyboard shortcut navigation.
- **3-Column Documentation View:**
  - **Left:** Collapsible category navigation sidebar (`DocsSidebar`).
  - **Center:** Main reading pane with reading time calculation, updated date badges, and copyable code blocks.
  - **Right:** Auto-generated sticky "On This Page" Table of Contents (`OnThisPage`).
- **Appwrite Authentication & Verification:** Native email verification, password recovery, session management, and profile customization.

---

## 🏗️ System Architecture

CodeFolio uses a clean, layered architecture separating UI, global state, routing, and backend API service abstractions.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        React 19 Frontend (Vite)                        │
├──────────────────┬──────────────────────┬──────────────────────────────┤
│  Pages / Views   │  UI Components       │  Global State (Redux)        │
│  - Home          │  - Header & Search   │  - Auth Status               │
│  - Post / All    │  - TipTap RTE        │  - User Data                 │
│  - VerifyEmail   │  - Sidebar & TOC     │  - Profile Customization     │
│  - Forgot/Reset  │  - Auth Forms        │                              │
└────────┬─────────┴──────────┬───────────┴──────────────┬───────────────┘
         │                    │                          │
         ▼                    ▼                          ▼
┌────────────────────────────────────────────────────────────────────────┐
│                  Service Abstraction Layer (`src/services`)             │
│   - authService (Authentication, Verification, Recovery)               │
│   - dbService (CRUD Articles, Image Bucket Storage)                    │
│   - profileService (Author Bios, Social Links, Achievements)           │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │ Appwrite Web SDK
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      Appwrite Cloud Backend (BaaS)                     │
│   - Account & Auth Service  - NoSQL Database  - Storage Buckets        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Authentication & Token Workflows

Appwrite Cloud utilizes secure **one-time secret tokens** attached to URLs for email verification and password recovery.

### 1. Email Verification Flow

When a user signs up, an email verification link containing a `userId` and a one-time `secret` query parameter is automatically sent to their email.

#### **Sequence Diagram:**

```
[User]                 [React Frontend]               [Appwrite Backend]
  │                           │                              │
  ├── 1. Submit Signup ──────>│                              │
  │   (name, email, pass)     ├── 2. createAccount() ───────>│
  │                           │    & createSession()         │
  │                           │<── 3. Session Created ───────│
  │                           │                              │
  │                           ├── 4. createVerification(url)>│
  │                           │<── 5. Email Sent with Token ─┤
  │                           │                              │
  │── 6. Clicks Email Link ──>│                              │
  │   (/verify-email?id&secret)                          │
  │                           ├── 7. confirmVerification() ─>│
  │                           │      (userId, secret)        │
  │                           │<── 8. Token Validated ───────│
  │<── 9. Shows Verified UI ──┤                              │
```

#### **Technical Deep Dive & Double-Execution Guard:**
- **URL Format:** `http://localhost:5173/verify-email?userId=67...&secret=e2...`
- **Execution Guard (`useRef`):** In React development mode (`StrictMode`), components render twice. Because Appwrite's verification token is single-use, calling `updateVerification` twice causes the second call to throw `Invalid token passed`. `VerifyEmail.jsx` uses an `isExecuting = useRef(false)` guard to ensure the verification call runs **strictly once**, alongside a fallback check (`user.emailVerification`).

---

### 2. Password Reset / Recovery Flow

Allows users to safely recover their account if they forget their password.

#### **Sequence Diagram:**

```
[User]                 [React Frontend]               [Appwrite Backend]
  │                           │                              │
  ├── 1. Click "Forgot Pass"─>│                              │
  │   Enter email             ├── 2. createRecovery(email)──>│
  │                           │<── 3. Recovery Email Sent ───│
  │                           │                              │
  │── 4. Clicks Email Link ──>│                              │
  │   (/reset-password?id&secret)                            │
  │                           │                              │
  ├── 5. Enters New Pass ────>│                              │
  │                           ├── 6. updateRecovery() ──────>│
  │                           │      (userId, secret, pass)  │
  │                           │<── 7. Password Updated ──────│
  │<── 8. Redirects to Login ─┤                              │
```

#### **Technical Deep Dive:**
- **Request Page (`/forgot-password`):** The user enters their email. `authService.sendPasswordRecovery(email, redirectUrl)` is invoked, triggering Appwrite to dispatch the recovery email.
- **Reset Page (`/reset-password`):** Extracts `userId` and `secret` from URL search params (`useSearchParams`). When submitted, `authService.confirmPasswordReset(userId, secret, newPassword)` updates the credentials on Appwrite and redirects the user to `/login`.

---

## 🧩 Project Structure

```
12reactMegaProject/
├── src/
│   ├── appwriteServices/       # BaaS Abstraction Services
│   │   ├── auth.js            # Authentication, Verification & Reset SDK
│   │   ├── dbServices.js      # Blog Posts & Article Database Operations
│   │   └── profileService.js  # User Profiles, Social Links & Achievements
│   ├── components/            # Reusable UI Primitives & Components
│   │   ├── Header/            # Sticky Glass Header & Navigation
│   │   ├── Footer/            # Footer Links & Social Media Actions
│   │   ├── post-form/         # Post Form & Image Preview Card
│   │   ├── SearchModal.jsx    # Global Ctrl+K Search Dialog
│   │   ├── DocsSidebar.jsx    # Collapsible Category Navigation
│   │   ├── OnThisPage.jsx     # Auto-generated Table of Contents
│   │   ├── DocFooterNav.jsx   # Next/Prev Article Navigation
│   │   ├── RTE.jsx            # TipTap Rich Text Block Editor
│   │   └── Login.jsx / SignUp # Auth Card Components
│   ├── pages/                 # Client Views & Routes
│   │   ├── Home.jsx           # ChaiDocs Style Landing Page
│   │   ├── AllPost.jsx        # Article Grid View
│   │   ├── Post.jsx           # 3-Column Documentation Article Reader
│   │   ├── VerifyEmail.jsx    # Email Verification Handler
│   │   ├── ForgotPassword.jsx # Request Recovery Link
│   │   └── ResetPassword.jsx  # New Password Form
│   ├── store/                 # Redux Toolkit Global State
│   └── main.jsx               # React Router Route Configuration
├── index.html                 # Main Entry Point & Inter/JetBrains Fonts
└── tailwind.config.js         # Design Token Extensions (Colors, Typography)
```

---

## ⚡ Quick Start & Setup

### Prerequisites
- **Node.js**: v18.x or higher
- **Appwrite Cloud Account** (or self-hosted Appwrite instance)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/piyusdev2006/BlogWebApp.git
cd BlogWebApp
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
VITE_APPWRITE_URL=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_DATABASE_ID=your_database_id
VITE_APPWRITE_COLLECTION_ID=your_articles_collection_id
VITE_APPWRITE_BUCKET_ID=your_images_bucket_id
```

### 3. Appwrite Platform Configuration
In your [Appwrite Console](https://cloud.appwrite.io/):
1. Go to **Overview / Settings** -> **Platforms**.
2. Click **Add Platform** -> **Web App**.
3. Set **Hostname** to `localhost`.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🛠️ Developer Tooling

- **Build System:** Vite + Rolldown bundler
- **Styling:** Tailwind CSS (utility-first with custom token system)
- **Editor:** TipTap (`@tiptap/react` + `@tiptap/starter-kit`)
- **State Management:** Redux Toolkit (`@reduxjs/toolkit`)
- **Form Handling:** React Hook Form (`react-hook-form`)
