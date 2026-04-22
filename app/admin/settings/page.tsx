import { auth } from "@/lib/auth"
import { 
  Settings, 
  User, 
  Shield, 
  Bell, 
  Database, 
  Lock,
  Mail,
  Smartphone,
  Save,
  ChevronRight
} from "lucide-react"
import Link from "next/link"

export default async function AdminSettingsPage() {
  const session = await auth()
  const user = session?.user

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-5xl font-bebas tracking-wider text-gray-900 uppercase mb-2">Account Settings</h1>
        <p className="text-gray-500 font-dm-sans">Manage your personal profile and platform preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Navigation */}
        <div className="lg:col-span-1">
           <nav className="space-y-1">
              {[
                { name: "Profile", icon: User, active: true },
                { name: "Security", icon: Lock, active: false },
                { name: "Notifications", icon: Bell, active: false },
                { name: "System", icon: Database, active: false },
              ].map((item) => (
                <button
                  key={item.name}
                  className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${
                    item.active 
                      ? "bg-[#E85D04] text-white shadow-lg shadow-[#E85D04]/20" 
                      : "text-gray-400 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <item.icon size={18} />
                  {item.name}
                </button>
              ))}
           </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-8">
           {/* Profile Section */}
           <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bebas tracking-wide text-gray-900 mb-8 flex items-center gap-3 uppercase">
                 Personal Profile
              </h3>
              
              <div className="space-y-8">
                 <div className="flex items-center gap-8">
                    <div className="w-24 h-24 rounded-[32px] bg-gray-50 border-4 border-white shadow-xl flex items-center justify-center text-3xl font-bold text-[#E85D04]">
                       {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </div>
                    <div>
                       <button className="px-6 py-3 bg-gray-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-black transition-all">
                          Change Photo
                       </button>
                       <p className="text-[10px] text-gray-400 mt-3 font-medium uppercase tracking-widest">JPG, PNG or GIF. Max size 2MB.</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">First Name</label>
                       <input 
                         type="text" 
                         defaultValue={user?.firstName}
                         className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-transparent focus:border-[#E85D04]/30 focus:bg-white outline-none transition-all font-medium text-gray-900"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Last Name</label>
                       <input 
                         type="text" 
                         defaultValue={user?.lastName}
                         className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-transparent focus:border-[#E85D04]/30 focus:bg-white outline-none transition-all font-medium text-gray-900"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                       <div className="relative">
                          <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                          <input 
                            type="email" 
                            defaultValue={user?.email || ""}
                            className="w-full pl-14 pr-6 py-4 bg-gray-50 rounded-2xl border border-transparent focus:border-[#E85D04]/30 focus:bg-white outline-none transition-all font-medium text-gray-900"
                          />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Contact Number</label>
                       <div className="relative">
                          <Smartphone className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                          <input 
                            disabled
                            type="text" 
                            defaultValue={user?.contact}
                            className="w-full pl-14 pr-6 py-4 bg-gray-50 rounded-2xl border border-transparent opacity-50 cursor-not-allowed font-medium text-gray-900"
                          />
                       </div>
                    </div>
                 </div>

                 <div className="pt-6 border-t border-gray-50 flex justify-end">
                    <button className="px-10 py-4 bg-[#E85D04] text-white rounded-2xl font-bold flex items-center gap-3 hover:bg-[#C44D03] transition-all shadow-lg shadow-[#E85D04]/20">
                       <Save size={18} />
                       SAVE CHANGES
                    </button>
                 </div>
              </div>
           </div>

           {/* Security Settings Preview */}
           <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bebas tracking-wide text-gray-900 mb-8 flex items-center gap-3 uppercase">
                 Security & Privacy
              </h3>
              <div className="space-y-4">
                 {[
                   { title: "Change Password", desc: "Update your administrative login credentials", icon: Lock },
                   { title: "Two-Factor Auth", desc: "Add an extra layer of security to your account", icon: Shield },
                 ].map((item) => (
                   <button key={item.title} className="w-full flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100 hover:border-[#E85D04]/30 group transition-all">
                      <div className="flex items-center gap-6 text-left">
                         <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-gray-400 group-hover:text-[#E85D04] transition-all">
                            <item.icon size={20} />
                         </div>
                         <div>
                            <p className="font-bold text-gray-900">{item.title}</p>
                            <p className="text-xs text-gray-500">{item.desc}</p>
                         </div>
                      </div>
                      <ChevronRight size={20} className="text-gray-300 group-hover:text-[#E85D04] transition-all" />
                   </button>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
