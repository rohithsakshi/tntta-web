import { Scale, FileCheck, AlertCircle, Info } from "lucide-react"

export default function TermsPage() {
  const sections = [
    {
      title: "Platform Usage",
      content: "The TNTTA digital platform is provided to streamline sports management. Users are responsible for maintaining the confidentiality of their login credentials and for all activities that occur under their account."
    },
    {
      title: "Player Eligibility",
      content: "Players must provide accurate and truthful information during registration. Any misrepresentation of age, district, or ranking history may result in immediate disqualification from sanctioned tournaments."
    },
    {
      title: "Tournament Entries",
      content: "By applying for a tournament, you agree to abide by the rules and regulations set forth by the organizing committee and TNTTA. Match decisions by official referees are final."
    },
    {
      title: "Code of Conduct",
      content: "All athletes, coaches, and parents are expected to maintain the highest standards of sportsmanship. Abuse of officials, opponents, or the platform will not be tolerated."
    }
  ]

  return (
    <div className="bg-[#FAFAFA] min-h-screen pb-24">
      {/* Header */}
      <div className="bg-[#0A0A0A] text-white py-24 relative overflow-hidden text-center">
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <h1 className="text-6xl font-bebas tracking-wider mb-4 animate-fadeIn">Terms of Service</h1>
          <p className="text-xl text-gray-400 font-dm-sans max-w-2xl mx-auto leading-relaxed">
            The guidelines and legal framework for participating in the TNTTA ecosystem.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 -mt-10 relative z-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-[40px] p-10 lg:p-20 shadow-xl border border-gray-100">
            <div className="flex items-center gap-4 mb-12 pb-6 border-b border-gray-50">
               <Scale className="text-[#E85D04]" size={32} />
               <div>
                 <p className="text-[#E85D04] font-bold text-xs uppercase tracking-widest mb-1">Official Terms</p>
                 <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Effective Date: April 2026</p>
               </div>
            </div>

            <div className="space-y-12">
              {sections.map((section) => (
                <section key={section.title}>
                  <h2 className="text-2xl font-bebas tracking-wide text-gray-900 mb-4 flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#E85D04] rounded-full" />
                    {section.title}
                  </h2>
                  <p className="text-gray-500 font-dm-sans leading-relaxed text-lg pl-5">
                    {section.content}
                  </p>
                </section>
              ))}
            </div>

            <div className="mt-16 p-8 bg-orange-50 border border-orange-100 rounded-3xl flex gap-6">
              <AlertCircle className="text-[#E85D04] shrink-0" size={24} />
              <p className="text-sm text-orange-900 leading-relaxed">
                <strong>Important Notice:</strong> These terms are subject to change by the TNTTA Executive Committee. Continued use of the platform after changes implies acceptance of the updated terms.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
