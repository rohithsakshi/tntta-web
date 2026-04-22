"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { 
  User, 
  Phone, 
  Mail, 
  Lock, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  ChevronRight, 
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Building2
} from "lucide-react"
import { toast } from "react-hot-toast"
import type { Category, Gender } from "@prisma/client"

const districts = [
  "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", 
  "Dindigul", "Erode", "Kallakurichi", "Kancheepuram", "Kanyakumari", "Karur", 
  "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris", 
  "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", 
  "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", 
  "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", 
  "Viluppuram", "Virudhunagar"
]

const categories = [
  { id: "MINI_CADET" as Category, label: "Mini Cadet (U-10)", minAge: 0, maxAge: 10 },
  { id: "CADET" as Category, label: "Cadet (11-12)", minAge: 11, maxAge: 12 },
  { id: "SUB_JUNIOR" as Category, label: "Sub Junior (13-14)", minAge: 13, maxAge: 14 },
  { id: "JUNIOR" as Category, label: "Junior (15-17)", minAge: 15, maxAge: 17 },
  { id: "SENIOR" as Category, label: "Senior (18-39)", minAge: 18, maxAge: 39 },
  { id: "MENS" as Category, label: "Mens (18+)", minAge: 18, maxAge: 150 },
  { id: "VETERANS" as Category, label: "Veterans (40+)", minAge: 40, maxAge: 150 },
]

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    password: "",
    confirmPassword: "",
    gender: "MALE" as Gender,
    dob: "",
    district: "",
    club: "",
    category: "" as Category | "",
  })

  const [eligibleCategories, setEligibleCategories] = useState<typeof categories>([])

  useEffect(() => {
    if (formData.dob) {
      const birthDate = new Date(formData.dob)
      const age = new Date().getFullYear() - birthDate.getFullYear()
      const eligible = categories.filter(c => age >= c.minAge && age <= c.maxAge)
      setEligibleCategories(eligible)
      
      // Auto-select first eligible category if current selection is not eligible
      if (formData.category && !eligible.find(c => c.id === formData.category)) {
        setFormData(prev => ({ ...prev, category: "" }))
      }
    }
  }, [formData.dob])

  const handleNext = () => {
    // Basic validation for Step 1
    if (!formData.firstName || !formData.lastName || !formData.contact || !formData.dob || !formData.district || !formData.category || !formData.password) {
      toast.error("Please fill all required fields")
      return
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }
    if (formData.contact.length !== 10) {
      toast.error("Contact number must be 10 digits")
      return
    }
    setStep(2)
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (data.success) {
        setStep(3)
        toast.success("Registration details saved!")
      } else {
        toast.error(data.error || "Registration failed")
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between max-w-xs mx-auto mb-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  step >= s ? "bg-[#E85D04] text-white shadow-lg" : "bg-white text-gray-400 border-2 border-gray-200"
                }`}>
                  {step > s ? <CheckCircle2 size={20} /> : s}
                </div>
                {s < 3 && (
                  <div className={`w-12 h-1 mx-2 rounded ${step > s ? "bg-[#E85D04]" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-sm font-bold text-gray-500 uppercase tracking-widest">
            {step === 1 && "Personal Details"}
            {step === 2 && "Review & Payment"}
            {step === 3 && "Confirmation"}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
            >
              <h2 className="text-3xl font-bebas tracking-wide text-gray-900 mb-8 border-b pb-4">Player Registration</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <User size={16} /> First Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#E85D04] outline-none"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Last Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#E85D04] outline-none"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-bold text-gray-700 mb-3">Gender *</label>
                <div className="flex gap-4">
                  {["MALE", "FEMALE"].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setFormData({ ...formData, gender: g as Gender })}
                      className={`px-8 py-2 rounded-full text-sm font-bold transition-all border-2 ${
                        formData.gender === g 
                        ? "bg-[#E85D04] border-[#E85D04] text-white" 
                        : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar size={16} /> Date of Birth *
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#E85D04] outline-none"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <MapPin size={16} /> District *
                  </label>
                  <select
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#E85D04] outline-none bg-white"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  >
                    <option value="">Select District</option>
                    {districts.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-bold text-gray-700 mb-3">Eligible Category *</label>
                {!formData.dob ? (
                  <p className="text-sm text-gray-400 italic">Select Date of Birth first to see eligible categories</p>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {eligibleCategories.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, category: c.id })}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${
                          formData.category === c.id 
                          ? "bg-[#0077B6] border-[#0077B6] text-white shadow-md" 
                          : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <Phone size={16} /> Contact Number *
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10-digit mobile number"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#E85D04] outline-none"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value.replace(/\D/g, "") })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <Building2 size={16} /> Club Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. SK Academy"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#E85D04] outline-none"
                    value={formData.club}
                    onChange={(e) => setFormData({ ...formData, club: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <Lock size={16} /> Password *
                  </label>
                  <input
                    type="password"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#E85D04] outline-none"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Confirm Password *</label>
                  <input
                    type="password"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#E85D04] outline-none"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                </div>
              </div>

              <button
                onClick={handleNext}
                className="w-full py-4 bg-[#E85D04] text-white rounded-xl font-bold text-lg hover:bg-[#C44D03] transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                Continue to Review
                <ChevronRight size={20} />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
            >
              <button onClick={() => setStep(1)} className="flex items-center gap-2 text-gray-400 hover:text-gray-600 mb-8 font-bold text-sm">
                <ArrowLeft size={16} /> Back to Edit
              </button>

              <h2 className="text-3xl font-bebas tracking-wide text-gray-900 mb-8 border-b pb-4">Review Your Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 mb-12">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Full Name</p>
                  <p className="text-lg font-bold text-gray-900">{formData.firstName} {formData.lastName}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Gender</p>
                  <p className="text-lg font-bold text-gray-900">{formData.gender}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Date of Birth</p>
                  <p className="text-lg font-bold text-gray-900">{formData.dob}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Category</p>
                  <p className="text-lg font-bold text-gray-900">{formData.category.replace("_", " ")}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">District</p>
                  <p className="text-lg font-bold text-gray-900">{formData.district}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Contact</p>
                  <p className="text-lg font-bold text-gray-900">{formData.contact}</p>
                </div>
              </div>

              <div className="bg-[#E85D04]/5 border-2 border-dashed border-[#E85D04]/30 rounded-2xl p-8 mb-12 flex flex-col items-center">
                <p className="text-gray-600 font-bold mb-2">Annual Registration Fee</p>
                <p className="text-5xl font-bebas text-[#E85D04]">₹500</p>
              </div>

              <button
                disabled={isLoading}
                onClick={handleSubmit}
                className="w-full py-4 bg-[#E85D04] text-white rounded-xl font-bold text-lg hover:bg-[#C44D03] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-70"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : "Proceed to Payment"}
                {!isLoading && <ShieldCheck size={20} />}
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl shadow-2xl p-8 md:p-16 text-center border-t-8 border-[#E85D04]"
            >
              <div className="w-24 h-24 bg-orange-100 text-[#E85D04] rounded-full flex items-center justify-center mx-auto mb-8">
                <ShieldCheck size={48} />
              </div>
              <h2 className="text-4xl font-bebas tracking-wide text-gray-900 mb-4">Registration Saved!</h2>
              <p className="text-gray-600 mb-12 max-w-md mx-auto leading-relaxed">
                We are currently integrating our secure Razorpay gateway. Your details have been recorded in our system.
              </p>

              <div className="bg-gray-50 rounded-2xl p-8 mb-12 text-left space-y-4">
                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <span className="text-gray-500 font-medium">Status</span>
                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">PENDING PAYMENT</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-medium">Fee Amount</span>
                  <span className="text-gray-900 font-bold text-xl">₹500.00</span>
                </div>
              </div>

              <div className="space-y-4">
                <a 
                  href={`https://wa.me/919999999999?text=Hi, I am ${formData.firstName} ${formData.lastName}. I just registered on TNTTA and want to complete my payment.`}
                  target="_blank"
                  className="w-full py-4 bg-[#25D366] text-white rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-[#128C7E] transition-all"
                >
                  <Phone size={20} />
                  Chat on WhatsApp for Payment
                </a>
                <Link 
                  href="/login"
                  className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-black transition-all"
                >
                  Go to Login
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}