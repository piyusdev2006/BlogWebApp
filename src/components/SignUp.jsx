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
    const { register, handleSubmit } = useForm()

    const SignUpAccount = async(data) => {
        setError("")
        try {
            const user = await authService.createAccount(data)
            if (user) {
                const loggedUser = await authService.getCurrentUser()
              if (loggedUser) dispatch(login(loggedUser))
              
              navigate("/")  
            }
        } catch (error) {
            setError(error.message)
        }
    }


    return (
      <div className="flex items-center justify-center min-h-[70vh] page-enter">
        <div className="mx-auto w-full max-w-md bg-surface-1 rounded-lg p-8 md:p-10 border border-hairline">
          <div className="mb-6 flex justify-center">
            <Logo width="140px" />
          </div>

          <h2 className="text-center text-headline text-ink font-display">
            Create your account
          </h2>

          <p className="mt-2 text-center text-body-sm text-ink-subtle">
            Already have an account?&nbsp;
            <Link
              to="/login"
              className="font-medium text-primary transition-colors duration-200 hover:text-primary-hover"
            >
              Sign In
            </Link>
          </p>

          {error && (
            <div className="mt-6 px-4 py-3 rounded-md bg-red-500/10 border border-red-500/20">
              <p className="text-body-sm text-red-400 text-center">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(SignUpAccount)} className="mt-8">
            <div className="space-y-5">
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                {...register("name", {
                  required: true,
                })}
              />
              <Input
                label="Email"
                placeholder="Enter your email"
                type="email"
                {...register("email", {
                  required: true,
                  validate: {
                    matchPatern: (value) =>
                      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
                        value,
                      ) || "Email address must be a valid address",
                  },
                })}
              />
              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                {...register("password", {
                  required: true,
                })}
              />
              <Button type="submit" className="w-full">
                Create Account
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
}

export default SignUp
