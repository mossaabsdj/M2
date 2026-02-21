"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

export default function LoadingModal({
  open,
  title = "Loading...",
  description = "Please wait while we process your request.",
}) {
  return (
    <Dialog open={open}>
      <AnimatePresence>
        {open ? (
          <DialogContent className="max-w-sm border-none bg-transparent p-0 shadow-none">
            {/* Overlay */}
            <motion.div
              key="overlay"
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              aria-hidden="true"
            />

            {/* Centered Card */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                key="card"
                className="w-full max-w-sm rounded-2xl border bg-background p-6 shadow-xl"
                initial={{ opacity: 0, scale: 0.96, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 8 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
              >
                {/* A11y (shadcn Dialog expects Title/Description) */}
                <DialogTitle className="sr-only">{title}</DialogTitle>
                <DialogDescription className="sr-only">
                  {description}
                </DialogDescription>

                <div className="flex flex-col items-center gap-3 text-center">
                  <motion.div
                    className="inline-flex h-14 w-14 items-center justify-center rounded-full border bg-muted"
                    initial={{ rotate: -10 }}
                    animate={{ rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 18 }}
                  >
                    <Loader2 className="h-7 w-7 animate-spin" />
                  </motion.div>

                  <div className="space-y-1">
                    <p className="text-base font-semibold">{title}</p>
                    <p className="text-sm text-muted-foreground">
                      {description}
                    </p>
                  </div>

                  {/* Animated progress bar (optional nice touch) */}
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className="h-full w-1/3 rounded-full bg-foreground"
                      initial={{ x: "-120%" }}
                      animate={{ x: "320%" }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </DialogContent>
        ) : null}
      </AnimatePresence>
    </Dialog>
  );
}
