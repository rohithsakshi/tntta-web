"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, ChevronLeft, Trophy, Users, Calendar, MapPin } from "lucide-react"

const slides = [
  {
    image: "/image1.jpg",
    title: "Upcoming Tournaments",
    subtitle: "Manage. Compete. Win – All in One Place.",
    badge: "Registration Open",
    cta: "Register Now",
    link: "/register"
  },
  {
    image: "/image2.jpg",
    title: "State Level Championships",
    subtitle: "Competing Across Tamil Nadu.",
    badge: "38 Districts",
    cta: "View Rankings",
    link: "/rankings"
  },
  {
    image: "/image3.jpg",
    title: "Table Tennis Excellence",
    subtitle: "Precision. Power. Performance.",
    badge: "Since 1960",
    cta: "Tournament Details",
    link: "/tournaments"
  }
]

export default function Hero() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length)
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)

  return (
    <section className="relative h-[calc(100vh-72px)] min-h-[600px] bg-black overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div className="relative w-full h-full">
            <Image 
              src={slides[current].image} 
              alt={slides[current].title} 
              fill 
              className="object-cover"
              priority={current === 0}
              unoptimized
            />
            {/* Dark Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-center container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl space-y-6">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E85D04]/20 border border-[#E85D04]/30 text-[#E85D04] text-xs font-bold tracking-widest uppercase"
              >
                <Trophy size={14} />
                {slides[current].badge}
              </motion.div>

              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-4xl sm:text-6xl md:text-8xl font-bebas tracking-wider text-white leading-[0.9]"
              >
                {slides[current].title}
              </motion.h1>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-base sm:text-lg md:text-xl text-gray-300 max-w-xl font-dm-sans"
              >
                {slides[current].subtitle}
              </motion.p>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 pt-4"
              >
                <Link 
                  href={slides[current].link}
                  className="bg-[#E85D04] text-white px-8 py-3 sm:py-4 rounded-md text-base sm:text-lg font-bold flex items-center justify-center gap-2 hover:bg-[#C44D03] transition-all shadow-[0_8px_30px_rgba(232,93,4,0.3)]"
                >
                  {slides[current].cta}
                  <ChevronRight size={20} />
                </Link>
                <Link 
                  href="/rankings"
                  className="bg-transparent text-white border-2 border-white/30 px-8 py-3 sm:py-4 rounded-md text-base sm:text-lg font-bold flex items-center justify-center hover:bg-white hover:text-black transition-all"
                >
                  View Rankings
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slide Indicators */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-1.5 sm:h-2 transition-all duration-300 rounded-full ${
              current === index ? "w-8 sm:w-12 bg-[#E85D04]" : "w-1.5 sm:w-2 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>

      {/* Navigation Arrows - Hidden on small mobile */}
      <div className="hidden sm:flex absolute top-1/2 -translate-y-1/2 left-4 md:left-8 z-20">
        <button onClick={prevSlide} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
          <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
        </button>
      </div>
      <div className="hidden sm:flex absolute top-1/2 -translate-y-1/2 right-4 md:right-8 z-20">
        <button onClick={nextSlide} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
          <ChevronRight size={20} className="sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Stats Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#0A0A0A]/90 backdrop-blur-sm border-t border-white/10 py-6 z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:flex md:justify-between items-center text-white gap-y-6 md:gap-y-0">
            <div className="flex items-center gap-3">
              <MapPin size={24} className="text-[#E85D04] shrink-0" />
              <div>
                <p className="text-xl font-bebas leading-none">38 DISTRICTS</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest">Active Across TN</p>
              </div>
            </div>
            <div className="hidden md:block w-[1px] h-8 bg-white/10" />
            <div className="flex items-center gap-3">
              <Users size={24} className="text-[#E85D04] shrink-0" />
              <div>
                <p className="text-xl font-bebas leading-none">500+ PLAYERS</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest">Registered Members</p>
              </div>
            </div>
            <div className="hidden md:block w-[1px] h-8 bg-white/10" />
            <div className="flex items-center gap-3">
              <Calendar size={24} className="text-[#E85D04] shrink-0" />
              <div>
                <p className="text-xl font-bebas leading-none">12 EVENTS</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest">Annual Schedule</p>
              </div>
            </div>
            <div className="hidden md:block w-[1px] h-8 bg-white/10" />
            <div className="flex items-center gap-3">
              <Trophy size={24} className="text-[#E85D04] shrink-0" />
              <div>
                <p className="text-xl font-bebas leading-none">SINCE 1960</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest">Legacy of Excellence</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}