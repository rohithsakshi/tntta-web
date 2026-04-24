"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { X, Maximize2, Filter, Upload, Camera } from "lucide-react"

const images = [
  { id: 1, url: "https://images.unsplash.com/photo-1593481878345-0d2685790c6b?w=800&h=600&q=85&auto=format&fit=crop", caption: "Professional Action Shot", category: "Tournament" },
  { id: 2, url: "https://images.unsplash.com/photo-1534158914592-062992fbe900?w=600&h=800&q=85&auto=format&fit=crop", caption: "High Intensity Rally", category: "Tournament" },
  { id: 3, url: "https://images.unsplash.com/photo-1619619163276-805161044733?w=600&h=800&q=85&auto=format&fit=crop", caption: "Competition Focus", category: "Tournament" },
  { id: 4, url: "https://media.istockphoto.com/id/1425158165/photo/table-tennis-ping-pong-paddles-and-white-ball-on-blue-board.jpg?s=612x612&w=is&k=20&c=q7kPR8BzNCOngSWY5t-VHNYfTK3_iQq4klx22sNAvS8=", caption: "Professional Equipment", category: "Training" },
  { id: 5, url: "https://media.istockphoto.com/id/178826162/photo/service-on-table-tennis.jpg?s=612x612&w=is&k=20&c=wN1HhMjrniuoHWhYs2BAobaIGUN_N6qJPjhnq9td1Tc=", caption: "Precision Serve", category: "Training" },
  { id: 6, url: "https://images.unsplash.com/photo-1544X0TzmHY?w=800&h=600&q=85&auto=format&fit=crop", caption: "Marcus Clark Competition", category: "Tournament" },
  { id: 7, url: "https://images.unsplash.com/photo-1578262825743-a4e402caab76?w=600&h=600&q=85&auto=format&fit=crop", caption: "Championship Trophy", category: "Winners" },
  { id: 8, url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&q=85&auto=format&fit=crop", caption: "Athletic Team Celebration", category: "Winners" },
  { id: 9, url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&h=800&q=85&auto=format&fit=crop", caption: "Victory Moment", category: "Winners" },
]

const categories = ["All", "Tournament", "Training", "Winners", "Events"]

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<typeof images[0] | null>(null)
  const [filter, setFilter] = useState("All")

  const filteredImages = filter === "All" 
    ? images 
    : images.filter(img => img.category === filter)

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      {/* Header */}
      <div className="bg-[#0A0A0A] text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('/hero-table-tennis.jpg')] bg-cover bg-center" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bebas tracking-wider mb-4 uppercase">Official Gallery</h1>
          <p className="text-lg sm:text-xl text-gray-400 font-dm-sans max-w-2xl">
            Capturing the speed, spirit, and skill of Tamil Nadu Table Tennis.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-12">
        {/* Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          <div className="flex gap-2 p-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto w-full md:w-auto">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${
                  filter === c 
                  ? "bg-[#0A0A0A] text-white shadow-lg" 
                  : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <Camera size={18} className="text-[#E85D04]" />
            {filteredImages.length} MOMENTS CAPTURED
          </p>
        </div>

        {/* Masonry Layout */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
          {filteredImages.map((image) => (
            <motion.div
              layout
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="group relative break-inside-avoid rounded-3xl overflow-hidden cursor-zoom-in shadow-sm hover:shadow-2xl transition-all duration-500"
              onClick={() => setSelectedImage(image)}
            >
              <Image 
                src={image.url} 
                alt={image.caption} 
                width={800}
                height={image.id % 2 === 0 ? 1000 : 600} // Fake varied heights for masonry
                className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-700"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                <p className="text-white font-bold text-lg mb-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{image.caption}</p>
                <p className="text-[#E85D04] font-bold text-xs uppercase tracking-widest translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">{image.category}</p>
              </div>
              <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 size={20} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 lg:p-12"
          >
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
            >
              <X size={48} strokeWidth={1.5} />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative w-full max-w-6xl aspect-[4/3] lg:aspect-video rounded-2xl overflow-hidden shadow-2xl"
            >
              <Image 
                src={selectedImage.url} 
                alt={selectedImage.caption} 
                fill 
                className="object-contain"
              />
            </motion.div>

            <div className="mt-8 text-center text-white">
              <h2 className="text-3xl font-bebas tracking-wide mb-2">{selectedImage.caption}</h2>
              <p className="text-[#E85D04] font-bold text-sm uppercase tracking-widest">{selectedImage.category}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}