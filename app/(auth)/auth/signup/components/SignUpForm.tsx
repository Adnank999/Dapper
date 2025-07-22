import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signup } from "@/lib/auth-actions";

export function SignUpForm() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 bg-background">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-rose-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>

      <Card className="mx-auto max-w-sm w-full relative backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
        {/* Glassmorphic overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-lg"></div>

        <CardHeader className="relative z-10 pb-2">
          <CardTitle className="text-xl font-bold text-center bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
            Create Account
          </CardTitle>
          <CardDescription className="text-center text-gray-200/80 text-sm">
            Join us today and get started
          </CardDescription>
        </CardHeader>

        <CardContent className="relative z-10 pt-0">
          <form action="">
            <div className="grid gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <Label
                    htmlFor="first-name"
                    className="text-white/90 text-sm font-medium"
                  >
                    First name
                  </Label>
                  <Input
                    name="first-name"
                    id="first-name"
                    placeholder="John"
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-300/60 focus:bg-white/20 focus:border-red-400/60 focus:ring-red-400/20 transition-all duration-300 backdrop-blur-sm h-8"
                  />
                </div>
                <div className="grid gap-1">
                  <Label
                    htmlFor="last-name"
                    className="text-white/90 text-sm font-medium"
                  >
                    Last name
                  </Label>
                  <Input
                    name="last-name"
                    id="last-name"
                    placeholder="Doe"
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-300/60 focus:bg-white/20 focus:border-red-400/60 focus:ring-red-400/20 transition-all duration-300 backdrop-blur-sm h-8"
                  />
                </div>
              </div>

              <div className="grid gap-1">
                <Label
                  htmlFor="email"
                  className="text-white/90 text-sm font-medium"
                >
                  Email Address
                </Label>
                <Input
                  name="email"
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-300/60 focus:bg-white/20 focus:border-red-400/60 focus:ring-red-400/20 transition-all duration-300 backdrop-blur-sm h-8"
                />
              </div>

              <div className="grid gap-1">
                <Label
                  htmlFor="password"
                  className="text-white/90 text-sm font-medium"
                >
                  Password
                </Label>
                <Input
                  name="password"
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-300/60 focus:bg-white/20 focus:border-red-400/60 focus:ring-red-400/20 transition-all duration-300 backdrop-blur-sm h-8"
                />
              </div>

              <Button
                formAction={signup}
                type="submit"
                className="w-full h-10 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] mt-2"
              >
                Create Account
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/20" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-transparent px-2 text-gray-300/80">
                    Or continue with
                  </span>
                </div>
              </div>
            </div>
          </form>

          <div className="mt-4 text-center text-sm">
            <span className="text-gray-200/80">Already have an account? </span>
            <Link
              href="/login"
              className="text-red-300 hover:text-red-200 transition-colors duration-300 underline underline-offset-4 font-medium"
            >
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
