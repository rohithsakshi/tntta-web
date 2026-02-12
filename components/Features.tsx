"use client";

import { motion } from "framer-motion";
import { CalendarDays, Trophy, BarChart3 } from "lucide-react";

const features = [
  {
    icon: CalendarDays,
    title: "Register for Events",
    desc: "Sign up for upcoming tournaments easily.",
  },
  {
    icon: Trophy,
    title: "Track Live Scores",
    desc: "Follow matches in real-time.",
  },
  {
    icon: BarChart3,
    title: "Check Player Rankings",
    desc: "See where you stand!",
  },
];

export default function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-center">

        {features.map((feature, index) => {
          const Icon = feature.icon;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="group bg-gray-50 rounded-xl p-10 shadow-md hover:shadow-xl transition-all duration-300"
            >
              {/* Icon Circle */}
              <motion.div
                whileHover={{ rotate: 5, scale: 1.05 }}
                className="mx-auto mb-6 w-20 h-20 flex items-center justify-center rounded-full bg-blue-100 group-hover:bg-blue-600 transition-colors duration-300"
              >
                <Icon className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors duration-300" />
              </motion.div>

              <h3 className="text-xl font-semibold mb-3">
                {feature.title}
              </h3>

              <p className="text-gray-600">
                {feature.desc}
              </p>
            </motion.div>
          );
        })}

      </div>
    </section>
  );
}