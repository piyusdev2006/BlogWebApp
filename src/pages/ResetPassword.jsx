import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import authService from "../appwriteServices/auth";
import { Button, Input, Logo } from "../components";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, watch } = useForm();

  const passwordValue = watch("password", "");

  const handleResetPassword = async (data) => {
    if (!userId || !secret) {
      setError("Invalid or missing password reset token. Please request a new link.");
      return;
    }

    setError("");
    setMessage("");
    setLoading(true);

    try {
      await authService.confirmPasswordReset(userId, secret, data.password);
      setMessage("Your password has been successfully reset! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } catch (err) {
      setError(err.message || "Failed to reset password. Token may have expired.");
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
          Set New Password
        </h2>

        <p className="mt-2 text-center text-body-sm text-ink-subtle">
          Please enter your new password below.
        </p>

        {(!userId || !secret) && (
          <div className="mt-6 px-4 py-3 rounded-md bg-red-500/10 border border-red-500/20">
            <p className="text-body-sm text-red-400 text-center">
              Missing verification credentials in URL. Please use the link sent to your email.
            </p>
          </div>
        )}

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

        <form onSubmit={handleSubmit(handleResetPassword)} className="mt-8">
          <div className="space-y-5">
            <Input
              label="New Password"
              placeholder="Enter new password"
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />

            <Input
              label="Confirm New Password"
              placeholder="Confirm new password"
              type="password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === passwordValue || "Passwords do not match",
              })}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={loading || !userId || !secret}
            >
              {loading ? "Updating Password..." : "Reset Password"}
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-body-sm text-ink-subtle hover:text-ink transition-colors"
          >
            ← Return to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
