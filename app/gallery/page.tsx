"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const images = Array.from({ length: 9 }, (_, i) => `/gallery-${i + 1}.jpg`);

export default function GalleryPage() {
  return (
    <div className="max-w-6xl mx-auto py-20 px-6 relative overflow-hidden">
      
      <motion.h1
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold mb-12 text-center"
      >
        Tournament Gallery
      </motion.h1>

      <div className="grid md:grid-cols-3 gap-8 relative">
        {images.map((src, index) => (
          <motion.div
            key={index}
            initial={{
              opacity: 0,
              scale: 0.3,
              x: 0,
              y: 0,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              x: 0,
              y: 0,
            }}
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 12,
              delay: index * 0.07,
            }}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.3 },
            }}
            className="overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300"
          >
            <Image
              src={src}
              alt={`Gallery Image ${index + 1}`}
              width={600}
              height={400}
              className="w-full h-64 object-cover"
              priority={index < 3}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}