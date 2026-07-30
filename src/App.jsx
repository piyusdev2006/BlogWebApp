import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import "./App.css";
import authService from "./appwriteServices/auth";
import profileService from "./appwriteServices/profileService";
import { login, logout, setProfile } from "./store/authSlice";
import { Footer, Header } from "./components";
import { Outlet } from "react-router";

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    authService
      .getCurrentUser()
      .then(async (userData) => {
        if (userData) {
          dispatch(login({ userData }));
          // Hydrate profile from DB — fail silently so app still loads
          try {
            const profile = await profileService.getProfile(userData.$id);
            dispatch(setProfile(profile));
          } catch (e) {
            console.warn("Could not load profile:", e);
            dispatch(setProfile(null));
          }
        } else {
          dispatch(logout());
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return loading ? (
    <div className="min-h-screen bg-canvas flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="loading-spinner" />
        <span className="text-body-sm text-ink-subtle animate-pulse-soft">Loading...</span>
      </div>
    </div>
  ) : (
    <div className="min-h-screen flex flex-col bg-canvas">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;
