"use client";

import { motion } from "framer-motion";
import { BookOpen, GraduationCap, PenTool, Play, Star } from "lucide-react";
import Image from "next/image";

// ── Animation helpers ──────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay, ease: "easeOut" },
});

const fadeLeft = (delay = 0) => ({
  initial: { opacity: 0, x: -36 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: "easeOut" },
});

const popIn = (delay = 0) => ({
  initial: { opacity: 0, scale: 0.75 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true },
  transition: {
    duration: 0.4,
    delay,
    type: "spring",
    stiffness: 220,
    damping: 20,
  },
});

// ── Data ───────────────────────────────────────────────────────────────────
const LEVELS = ["متوسط 1 – 4", "ثانوي 1 – 3", "BEM", "BAC"];

const STATS = [
  { value: "+500", label: "درس ومحاضرة", icon: BookOpen },
  { value: "+200", label: "تمرين محلول", icon: PenTool },
  { value: "+50", label: "أستاذ متخصص", icon: GraduationCap },
  { value: "4.9★", label: "تقييم الطلاب", icon: Star },
];

// ── Professor card ─────────────────────────────────────────────────────────
function ProfessorCard() {
  return (
    <motion.div
      {...fadeLeft(0.2)}
      className="relative flex-shrink-0 w-[260px] h-[380px] sm:w-[340px] sm:h-[460px] md:w-[380px] md:h-[500px]"
    >
      {/* Image */}
      <div className="absolute inset-0 rounded-3xl overflow-hidden flex items-end justify-center">
        <Image
          src="/images/prof.webp"
          width={340}
          height={460}
          alt="Professor"
          className="object-cover z-10 w-full h-full"
        />
      </div>

      {/* Subtle frame ring */}
      <div className="absolute inset-0 rounded-3xl ring-1 ring-green-200/60 pointer-events-none" />

      {/* Badge: Level */}
      <motion.div
        {...popIn(0.55)}
        className="absolute top-5 -right-4 bg-white border border-green-100 rounded-2xl px-4 py-2.5 shadow-md shadow-green-100/60"
      >
        <p
          className="text-gray-400 text-[11px] leading-none mb-1"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          المستوى
        </p>
        <p
          className="text-green-700 font-extrabold text-sm"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          CEM & Lycée
        </p>
      </motion.div>

      {/* Badge: Rating */}
      <motion.div
        {...popIn(0.7)}
        className="absolute bottom-14 -left-5 flex items-center gap-2.5 bg-white border border-green-100 rounded-2xl px-4 py-2.5 shadow-md shadow-green-100/60"
      >
        <Star className="text-green-500 w-4 h-4 fill-green-400" />
        <div>
          <p
            className="text-green-700 font-extrabold text-sm leading-none"
            style={{ fontFamily: "'Cairo', sans-serif" }}
          >
            4.9 / 5
          </p>
          <p
            className="text-gray-400 text-[11px] mt-0.5"
            style={{ fontFamily: "'Cairo', sans-serif" }}
          >
            تقييم الطلاب
          </p>
        </div>
      </motion.div>

      {/* Badge: Students */}
      <motion.div
        {...popIn(0.85)}
        className="absolute top-[38%] -left-6 flex items-center gap-2.5 bg-white border border-green-100 rounded-2xl px-4 py-2.5 shadow-md shadow-green-100/60"
      >
        <GraduationCap className="text-green-500 w-4 h-4" />
        <div>
          <p
            className="text-green-700 font-extrabold text-sm leading-none"
            style={{ fontFamily: "'Cairo', sans-serif" }}
          >
            +12,000
          </p>
          <p
            className="text-gray-400 text-[11px] mt-0.5"
            style={{ fontFamily: "'Cairo', sans-serif" }}
          >
            طالب مسجّل
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
