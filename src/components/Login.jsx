import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import authService from '../appwriteServices/auth'
import { login as authLogin } from '../store/authSlice'
import {Button, Input, Logo} from './index'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'


function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [error, setError] = useState("")
    const { register, handleSubmit } = useForm()

    const login = async(data) => {
        setError("")
        try {
            const session = await authService.login(data)
            if (session) {
                const userData = await authService.getCurrentUser()
                if(userData) {
                    dispatch(authLogin(userData))
                    navigate('/') // navigate program automatically not like Link in which we have to click on the link to navigate to the page.
                }
            }
        } catch (error) {
            setError('Login failed. Please try again.', error.message)
        }
    }

    return (
      <div className="flex items-center justify-center w-full min-h-[70vh] page-enter">
        <div className="mx-auto w-full max-w-md bg-surface-1 rounded-lg p-8 md:p-10 border border-hairline">
          <div className="mb-6 flex justify-center">
            <Logo width="140px" />
          </div>

          <h2 className="text-center text-headline text-ink font-display">
            Sign in to your account
          </h2>

          <p className="mt-2 text-center text-body-sm text-ink-subtle">
            Don&apos;t have any account?&nbsp;
            <Link
              to="/signup"
              className="font-medium text-primary transition-colors duration-200 hover:text-primary-hover"
            >
              Sign Up
            </Link>
          </p>

          {error && (
            <div className="mt-6 px-4 py-3 rounded-md bg-red-500/10 border border-red-500/20">
              <p className="text-body-sm text-red-400 text-center">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(login)} className="mt-8">
            <div className="space-y-5">
              <Input
                label="Email"
                placeholder="Enter your email"
                type="email"
                {...register("email", {
                  required: true,
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
                placeholder="Enter your password"
                type="password"
                {...register("password", {
                  required: true,
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
}

export default Login
