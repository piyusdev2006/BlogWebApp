import React, { useState } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import authService from "../appwriteServices/auth";
import { Button, Input, Logo } from "../components";

export default function ForgotPassword() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm();

  const handleRecovery = async (data) => {
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/reset-password`;
      await authService.sendPasswordRecovery(data.email, redirectUrl);
      setMessage("A password recovery link has been sent to your email address. Please check your inbox.");
    } catch (err) {
      setError(err.message || "Failed to send password recovery email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full min-h-[70vh] page-enter py-10 md:py-16">
      <div className="mx-auto w-full max-w-md bg-surface-1 rounded-lg p-8 md:p-10 border border-hairline">
        <div className="mb-6 flex justify-center">
          <Logo width="140px" />
        </div>

        <h2 className="text-center text-headline text-ink font-display">
          Forgot Your Password?
        </h2>

        <p className="mt-2 text-center text-body-sm text-ink-subtle">
          Enter your account email and we'll send you a password reset link.
        </p>

        {message && (
          <div className="mt-6 px-4 py-3 rounded-md bg-semantic-success/10 border border-semantic-success/20">
            <p className="text-body-sm text-semantic-success text-center">{message}</p>
          </div>
        )}

        {error && (
          <div className="mt-6 px-4 py-3 rounded-md bg-red-500/10 border border-red-500/20">
            <p className="text-body-sm text-red-400 text-center">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(handleRecovery)} className="mt-8">
          <div className="space-y-5">
            <Input
              label="Email Address"
              placeholder="Enter your email"
              type="email"
              {...register("email", {
                required: true,
                validate: {
                  matchPattern: (value) =>
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                    "Email address must be valid",
                },
              })}
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending link..." : "Send Reset Link"}
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-body-sm text-ink-subtle hover:text-ink transition-colors"
          >
            ← Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
