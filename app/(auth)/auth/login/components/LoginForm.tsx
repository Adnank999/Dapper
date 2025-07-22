import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


import { login } from "@/lib/auth-actions"
import { Chrome } from "lucide-react"
import SignInWithGoogleButton from "./SignInWithGoogleButton"



export function LoginForm() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
  {/* Background decoration */}
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
  </div>

  <Card className="mx-auto max-w-sm w-full relative backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
    {/* Glassmorphic overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-lg"></div>

    <CardHeader className="relative z-10">
      <CardTitle className="text-lg font-bold text-center bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
        Welcome Back
      </CardTitle>
      <CardDescription className="text-center text-gray-200/80 text-sm">
        Enter your credentials to access your account
      </CardDescription>
    </CardHeader>

    <CardContent className="relative z-10">
      <form action="">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-white/90 font-medium">
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              required
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-300/60 focus:bg-white/20 focus:border-white/40 transition-all duration-300 backdrop-blur-sm h-10"
            />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-white/90 font-medium">
                Password
              </Label>
              <Link
                href="#"
                className="text-xs text-blue-300 hover:text-blue-200 transition-colors duration-300 underline underline-offset-2"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              required
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-300/60 focus:bg-white/20 focus:border-white/40 transition-all duration-300 backdrop-blur-sm h-10"
            />
          </div>

          <Button
            type="submit"
            formAction={login}
            className="w-full h-10 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
          >
            Sign In
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-transparent px-2 text-gray-300/80">Or continue with</span>
            </div>
          </div>

          <SignInWithGoogleButton />
        </div>
      </form>

      <div className="mt-4 text-center text-sm">
        <span className="text-gray-200/80">Don't have an account? </span>
        <Link
          href="/auth/signup"
          className="text-blue-300 hover:text-blue-200 transition-colors duration-300 underline underline-offset-2 font-medium"
        >
          Create one now
        </Link>
      </div>
    </CardContent>
  </Card>
</div>

  )
}
