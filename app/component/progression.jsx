"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function PageTransition({ isVisible }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg bg-black/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="w-24 h-24"
          >
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={86}
              height={86}
              className="rounded-3xl"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
