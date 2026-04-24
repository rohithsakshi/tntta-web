"use client"

import { useState, Suspense } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Eye, EyeOff, Phone, Lock, Loader2, AlertCircle } from "lucide-react"
import { toast } from "react-hot-toast"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"
  
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState<"PLAYER" | "ADMIN">("PLAYER")
  const [formData, setFormData] = useState({
    contact: "",
    password: "",
  })
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const res = await signIn("credentials", {
        contact: formData.contact,
        password: formData.password,
        redirect: false,
      })

      if (res?.error) {
        setError("Invalid contact number or password")
        toast.error("Invalid contact number or password")
      } else {
        toast.success("Logged in successfully!")
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (err) {
      setError("An unexpected error occurred")
      toast.error("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* LEFT PANEL - Hidden on mobile */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-1/2 bg-[#0A0A0A] relative overflow-hidden flex-col items-center justify-center p-12 text-white"
      >
        <Image
          src="https://images.unsplash.com/photo-1511067007398-7e4b90cfa4bc?w=900&h=1200&q=90&auto=format&fit=crop" // SVZOV8Zkvh4 equivalent
          alt="Tamil Nadu table tennis player in action"
          fill
          className="object-cover"
          priority
          unoptimized
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Image 
              src="/TNTTA_logo.png" 
              alt="TNTTA Logo" 
              width={160} 
              height={160} 
              className="object-contain"
            />
          </motion.div>
          
          <h1 className="text-7xl font-bold font-bebas tracking-wider mb-4 leading-none">
            COMPETE. RANK. WIN.
          </h1>
          <p className="text-xl text-gray-300 max-w-md font-dm-sans">
            The official platform for the Tamil Nadu Table Tennis Association.
          </p>
        </div>
      </motion.div>

      {/* RIGHT PANEL - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Image src="/TNTTA_logo.png" alt="TNTTA Logo" width={160} height={160} className="object-contain" />
          </div>

          <div className="mb-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-[#E85D04] text-xs font-bold mb-4 uppercase tracking-wider border border-orange-200">
              <span className="w-2 h-2 rounded-full bg-[#E85D04] animate-pulse" />
              Demo Mode Active
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2 font-dm-sans">Welcome Back</h2>
            <p className="text-gray-500 mb-2">Sign in to your TNTTA account</p>
            <div className="p-3 bg-gray-50 rounded-lg text-xs text-gray-600 border border-gray-100">
              <p className="font-bold mb-1 uppercase tracking-tight">Quick Access:</p>
              <p>Player: <code className="bg-gray-200 px-1 rounded">9999999999</code> / <code className="bg-gray-200 px-1 rounded">password</code></p>
              <p>Admin: <code className="bg-gray-200 px-1 rounded">0000000000</code> / <code className="bg-gray-200 px-1 rounded">admin</code></p>
              <p className="mt-1 italic">* Or use any credentials to enter as demo player</p>
            </div>
          </div>

          {/* Role Selector */}
          <div className="flex p-1 bg-gray-100 rounded-lg mb-8">
            <button
              onClick={() => setRole("PLAYER")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                role === "PLAYER" 
                ? "bg-white text-gray-900 shadow-sm" 
                : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Player
            </button>
            <button
              onClick={() => setRole("ADMIN")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                role === "ADMIN" 
                ? "bg-white text-gray-900 shadow-sm" 
                : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Admin
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 flex items-center gap-3 text-red-700">
              <AlertCircle size={20} />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Phone size={18} />
                </div>
                <input
                  type="tel"
                  required
                  placeholder="9876543210"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#E85D04] focus:border-[#E85D04] transition-all"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link 
                  href="/forgot-password" 
                  className="text-sm font-medium text-[#E85D04] hover:text-[#C44D03]"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#E85D04] focus:border-[#E85D04] transition-all"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-[#E85D04] hover:bg-[#C44D03] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E85D04] font-bold transition-all disabled:opacity-70"
            >
              {isLoading ? (
                <Loader2 className="animate-spin mr-2" size={20} />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-600 font-dm-sans">
            Don&apos;t have an account?{" "}
            <Link 
              href="/register" 
              className="font-bold text-[#E85D04] hover:text-[#C44D03]"
            >
              Register Now
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <Loader2 className="w-12 h-12 text-[#E85D04] animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}