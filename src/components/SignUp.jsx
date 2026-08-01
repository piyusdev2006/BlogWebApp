import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import authService from '../appwriteServices/auth'
import { login } from '../store/authSlice'
import {Button, Input, Logo} from './index'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'

function SignUp() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const { register, handleSubmit } = useForm()

    const SignUpAccount = async(data) => {
        setError("")
        setLoading(true)
        try {
            const user = await authService.createAccount(data)
            if (user) {
                const loggedUser = await authService.getCurrentUser()
                if (loggedUser) {
                    dispatch(login({ userData: loggedUser }))
                    // Send verification email
                    try {
                        const redirectUrl = `${window.location.origin}/verify-email`;
                        await authService.sendVerification(redirectUrl);
                    } catch (verifyErr) {
                        console.log("Verification email trigger notice:", verifyErr);
                    }
                }
                navigate("/")  
            }
        } catch (err) {
            setError(err?.message || "Failed to create account. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
      <div className="flex items-center justify-center min-h-[75vh] page-enter py-12">
        <div className="mx-auto w-full max-w-md bg-surface-1 rounded-2xl p-8 md:p-10 border border-hairline shadow-2xl relative overflow-hidden">
          {/* Subtle lavender gradient accent at top */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />

          <div className="mb-6 flex justify-center">
            <Logo width="140px" />
          </div>

          <h2 className="text-center text-headline text-ink font-display tracking-tight">
            Create your account
          </h2>

          <p className="mt-2 text-center text-body-sm text-ink-subtle">
            Already have an account?&nbsp;
            <Link
              to="/login"
              className="font-medium text-primary transition-colors duration-200 hover:text-primary-hover underline underline-offset-2"
            >
              Sign In
            </Link>
          </p>

          {error && (
            <div className="mt-6 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-2.5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" className="flex-shrink-0 mt-0.5">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <p className="text-body-sm text-red-400 leading-snug">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(SignUpAccount)} className="mt-8">
            <div className="space-y-5">
              <Input
                label="Full Name"
                placeholder="Alex Dev"
                {...register("name", {
                  required: "Full name is required",
                })}
              />
              <Input
                label="Email Address"
                placeholder="developer@domain.com"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  validate: {
                    matchPattern: (value) =>
                      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
                        value,
                      ) || "Email address must be a valid address",
                  },
                })}
              />
              <Input
                label="Password"
                type="password"
                placeholder="Minimum 6 characters"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              <Button type="submit" disabled={loading} className="w-full py-3">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
}

export default SignUp;

