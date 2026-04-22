import { HelpCircle, ChevronDown, Info, Shield, CreditCard, UserPlus } from "lucide-react"

export default function FAQPage() {
  const faqs = [
    {
      category: "Registration",
      icon: UserPlus,
      questions: [
        {
          q: "How do I get my TNTTA ID?",
          a: "Once you complete your registration and pay the annual association fee, a unique TNTTA ID (e.g., TNTTA-2025-XXXX) will be automatically generated and visible on your dashboard profile."
        },
        {
          q: "I forgot my password. How can I reset it?",
          a: "Currently, you can contact the admin via WhatsApp or Email from the Support section to request a password reset for your registered contact number."
        }
      ]
    },
    {
      category: "Tournaments",
      icon: HelpCircle,
      questions: [
        {
          q: "Can I register for multiple categories in a tournament?",
          a: "Yes, you can register for all categories for which you are eligible based on your age and gender. Each category will require a separate entry fee as defined by the tournament organizer."
        },
        {
          q: "What is the refund policy for tournament entries?",
          a: "Registration fees are generally non-refundable once the tournament draws are published. Please check the specific rules for each tournament for more details."
        }
      ]
    },
    {
      category: "Payments",
      icon: CreditCard,
      questions: [
        {
          q: "Is it safe to pay online on the TNTTA portal?",
          a: "Absolutely. We use Razorpay, India's leading secure payment gateway, with industry-standard encryption for all transactions."
        }
      ]
    }
  ]

  return (
    <div className="bg-[#FAFAFA] min-h-screen pb-24">
      {/* Header */}
      <div className="bg-[#0A0A0A] text-white py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          <h1 className="text-6xl font-bebas tracking-wider mb-4 animate-fadeIn uppercase">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-400 font-dm-sans max-w-2xl mx-auto leading-relaxed">
            Find quick answers to common questions about player registration, tournament entry, and ranking systems.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 -mt-10 relative z-20">
        <div className="max-w-4xl mx-auto space-y-12">
          {faqs.map((group) => (
            <div key={group.category} className="space-y-6">
              <div className="flex items-center gap-3 ml-2">
                <group.icon className="text-[#E85D04]" size={24} />
                <h2 className="text-2xl font-bebas tracking-wide text-gray-900 uppercase">{group.category}</h2>
              </div>
              <div className="space-y-4">
                {group.questions.map((faq, idx) => (
                  <div key={idx} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-start gap-4">
                      <span className="w-8 h-8 shrink-0 bg-gray-50 rounded-full flex items-center justify-center text-[#E85D04] text-xs">Q</span>
                      {faq.q}
                    </h3>
                    <p className="text-gray-500 font-dm-sans leading-relaxed pl-12">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Still have questions? */}
          <div className="bg-gray-900 rounded-[40px] p-12 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#E85D04]/20 to-transparent opacity-50" />
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <HelpCircle size={32} className="text-[#E85D04]" />
              </div>
              <h2 className="text-3xl font-bebas tracking-wide mb-4">Still have questions?</h2>
              <p className="text-gray-400 mb-10 max-w-sm mx-auto">Our support team is ready to assist you with any specific queries you may have.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/contact" className="px-10 py-4 bg-[#E85D04] text-white rounded-xl font-bold hover:bg-[#C44D03] transition-all shadow-lg">Contact Support</a>
                <a href="https://wa.me/919999999999" target="_blank" className="px-10 py-4 bg-white/10 border border-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-all backdrop-blur-sm">Chat on WhatsApp</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
