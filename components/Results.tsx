"use client";

import { motion } from "framer-motion";

const results = [
  {
    stage: "Final Match",
    player1: "R. Kumar",
    score: "3 - 1",
    player2: "S. Mehta",
    sets: "(11-6, 9-11, 11-7, 11-6)",
  },
  {
    stage: "Semi-Final",
    player1: "A. Singh",
    score: "3 - 2",
    player2: "V. Patel",
    sets: "(11-6, 7-11, 12-10, 8-11, 11-9)",
  },
];

export default function Results() {
  return (
    <section className="px-20 py-20 bg-gray-50">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-3xl font-bold mb-12"
      >
        Latest Results
      </motion.h2>

      <div className="space-y-8">
        {results.map((match, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-8 flex justify-between items-center"
          >
            <div>
              <p className="text-sm text-gray-500 mb-3">{match.stage}</p>

              <div className="flex items-center gap-6 text-lg font-semibold">
                <span>{match.player1}</span>

                <motion.span
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md"
                >
                  {match.score}
                </motion.span>

                <span>{match.player2}</span>
              </div>
            </div>

            <div className="text-gray-500 text-sm">
              {match.sets}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}