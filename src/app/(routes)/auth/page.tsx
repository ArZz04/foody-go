"use client"

import { useSearchParams } from "next/navigation"
import LoginForm from "@/app/components/auth/loginForm"
import RegisterForm from "@/app/components/auth/RegisterForm"

export default function AuthPage() {
  const searchParams = useSearchParams()
  const mode = searchParams.get("mode") || "login"

  return (
    <div className="min-h-screen bg-emerald-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Panel */}
        <div className="hidden lg:block">
          <div className="bg-emerald-400/80 rounded-3xl h-96 w-full"></div>
        </div>

        {/* Right Panel */}
        <div className="w-full max-w-md mx-auto">
          {mode === "register" ? <RegisterForm /> : <LoginForm />}

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-emerald-300/60 text-sm">© 2025 Foody Go</p>
          </div>
        </div>
      </div>
    </div>
  )
}
