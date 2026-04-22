import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] text-white pt-16 pb-8 border-t border-white/10">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Logo & Tagline */}
          <div className="space-y-6 text-center md:text-left">
            <div className="flex justify-center md:justify-start">
              <Image src="/TNTTA_logo.png" alt="TNTTA Logo" width={150} height={60} className="h-12 w-auto object-contain" />
            </div>
            <p className="text-gray-400 font-dm-sans leading-relaxed max-w-sm mx-auto md:mx-0">
              Official platform of the Tamil Nadu Table Tennis Association. Promoting excellence in table tennis across the state since 1960.
            </p>
            <div className="flex gap-4 justify-center md:justify-start">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#E85D04] transition-all">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#E85D04] transition-all">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#E85D04] transition-all">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-xl font-bebas tracking-wider text-white">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link href="/tournaments" className="text-gray-400 hover:text-[#E85D04] transition-colors">Tournaments</Link></li>
              <li><Link href="/rankings" className="text-gray-400 hover:text-[#E85D04] transition-colors">Player Rankings</Link></li>
              <li><Link href="/results" className="text-gray-400 hover:text-[#E85D04] transition-colors">Match Results</Link></li>
              <li><Link href="/gallery" className="text-gray-400 hover:text-[#E85D04] transition-colors">Photo Gallery</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-[#E85D04] transition-colors">About TNTTA</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-6">
            <h4 className="text-xl font-bebas tracking-wider text-white">Support</h4>
            <ul className="space-y-3">
              <li><Link href="/login" className="text-gray-400 hover:text-[#E85D04] transition-colors">Player Login</Link></li>
              <li><Link href="/register" className="text-gray-400 hover:text-[#E85D04] transition-colors">New Registration</Link></li>
              <li><Link href="/faqs" className="text-gray-400 hover:text-[#E85D04] transition-colors">FAQs</Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-[#E85D04] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-[#E85D04] transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="text-xl font-bebas tracking-wider text-white">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex gap-4 text-gray-400">
                <MapPin size={24} className="text-[#E85D04] shrink-0" />
                <p>TNTTA, Nehru Stadium, Periamet, Chennai, Tamil Nadu 600003</p>
              </div>
              <div className="flex gap-4 text-gray-400">
                <Phone size={20} className="text-[#E85D04] shrink-0" />
                <p>+91 98765 43210</p>
              </div>
              <div className="flex gap-4 text-gray-400">
                <Mail size={20} className="text-[#E85D04] shrink-0" />
                <p>contact@tntta.org</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Tamil Nadu Table Tennis Association. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}