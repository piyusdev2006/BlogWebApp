import React, { useEffect, useState, useRef } from "react";
import { Link, useSearchParams } from "react-router";
import authService from "../appwriteServices/auth";
import { Button, Logo } from "../components";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");

  const [status, setStatus] = useState("verifying"); // 'verifying' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState("");
  const isExecuting = useRef(false);

  useEffect(() => {
    if (isExecuting.current) return;

    if (!userId || !secret) {
      setStatus("error");
      setErrorMessage("Invalid or missing email verification parameters in the URL.");
      return;
    }

    isExecuting.current = true;

    authService
      .confirmVerification(userId, secret)
      .then(() => {
        setStatus("success");
      })
      .catch(async (err) => {
        // Fallback check: If the token was already consumed in previous attempt or user is verified
        try {
          const user = await authService.getCurrentUser();
          if (user && user.emailVerification) {
            setStatus("success");
            return;
          }
        } catch (_) {}

        setStatus("error");
        setErrorMessage(
          err?.message || "Failed to verify email. The link may have already been used or expired."
        );
      });
  }, [userId, secret]);

  return (
    <div className="flex items-center justify-center w-full min-h-[70vh] page-enter py-10 md:py-16">
      <div className="mx-auto w-full max-w-md bg-surface-1 rounded-lg p-8 md:p-10 border border-hairline text-center">
        <div className="mb-6 flex justify-center">
          <Logo width="140px" />
        </div>

        {status === "verifying" && (
          <div className="py-8 space-y-4">
            <div className="loading-spinner mx-auto" />
            <h2 className="text-headline text-ink font-display">Verifying Your Email</h2>
            <p className="text-body-sm text-ink-subtle">
              Please wait while we confirm your credentials with Appwrite...
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="py-6 space-y-4">
            <div className="w-14 h-14 rounded-full bg-semantic-success/20 border border-semantic-success/40 text-semantic-success flex items-center justify-center mx-auto">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="text-headline text-ink font-display">Email Verified!</h2>
            <p className="text-body-sm text-ink-subtle">
              Your account has been successfully verified. You now have full access to CodeFolio.
            </p>
            <div className="pt-4">
              <Link to="/">
                <Button className="w-full">Go to Homepage</Button>
              </Link>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="py-6 space-y-4">
            <div className="w-14 h-14 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>
            <h2 className="text-headline text-ink font-display">Verification Failed</h2>
            <p className="text-body-sm text-red-400">{errorMessage}</p>
            <div className="pt-4">
              <Link to="/login">
                <Button variant="secondary" className="w-full">
                  Return to Sign In
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
