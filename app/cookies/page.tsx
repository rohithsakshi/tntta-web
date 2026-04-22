import { Cookie, Info, ShieldCheck, Settings } from "lucide-react"

export default function CookiesPage() {
  const cookieTypes = [
    {
      name: "Authentication Cookies",
      purpose: "Essential to keep you logged in to your player dashboard.",
      expiry: "Session",
      type: "Necessary"
    },
    {
      name: "Security Cookies",
      purpose: "Used to prevent CSRF attacks and ensure secure payments.",
      expiry: "1 Year",
      type: "Necessary"
    },
    {
      name: "Analytics Cookies",
      purpose: "Helps us understand which tournaments are most viewed to improve our platform.",
      expiry: "2 Years",
      type: "Optional"
    }
  ]

  return (
    <div className="bg-[#FAFAFA] min-h-screen pb-24">
      <div className="bg-[#0A0A0A] text-white py-24 relative overflow-hidden text-center">
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <h1 className="text-6xl font-bebas tracking-wider mb-4 animate-fadeIn">Cookie Policy</h1>
          <p className="text-xl text-gray-400 font-dm-sans max-w-2xl mx-auto leading-relaxed">
            How we use cookies to improve your experience on the TNTTA platform.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 -mt-10 relative z-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-[40px] p-10 lg:p-20 shadow-xl border border-gray-100">
            <div className="flex items-center gap-4 mb-12 pb-6 border-b border-gray-50">
               <Cookie className="text-[#E85D04]" size={32} />
               <div>
                 <p className="text-[#E85D04] font-bold text-xs uppercase tracking-widest mb-1">User Privacy</p>
                 <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Version: 1.0.0</p>
               </div>
            </div>

            <div className="prose prose-orange max-w-none text-gray-600 font-dm-sans leading-relaxed mb-16">
              <p>
                We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept", you consent to our use of cookies.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bebas tracking-wide text-gray-900 mb-8 uppercase">Cookie Inventory</h2>
              {cookieTypes.map((cookie) => (
                <div key={cookie.name} className="p-8 bg-gray-50 rounded-3xl border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-[#E85D04]/30 transition-all">
                  <div className="space-y-1">
                    <h3 className="font-bold text-gray-900">{cookie.name}</h3>
                    <p className="text-sm text-gray-500">{cookie.purpose}</p>
                  </div>
                  <div className="flex gap-4">
                    <span className="px-4 py-2 bg-white rounded-xl text-[10px] font-bold text-gray-400 uppercase tracking-widest border border-gray-100">{cookie.expiry}</span>
                    <span className="px-4 py-2 bg-[#E85D04]/10 rounded-xl text-[10px] font-bold text-[#E85D04] uppercase tracking-widest border border-[#E85D04]/10">{cookie.type}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-20 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gray-900 text-white rounded-2xl flex items-center justify-center mb-6">
                <Settings size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Manage Preferences</h3>
              <p className="text-gray-500 mb-8 max-w-sm">You can change your cookie settings at any time through your browser settings.</p>
              <button className="px-10 py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all">
                Browser Settings Guide
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
