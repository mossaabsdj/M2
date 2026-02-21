"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

const CONFIG = {
  success: {
    icon: CheckCircle2,
    iconClass: "text-emerald-600",
    ring: "bg-emerald-50 border-emerald-200",
    title: "Success",
  },
  error: {
    icon: XCircle,
    iconClass: "text-red-600",
    ring: "bg-red-50 border-red-200",
    title: "Error",
  },
  warning: {
    icon: AlertTriangle,
    iconClass: "text-amber-600",
    ring: "bg-amber-50 border-amber-200",
    title: "Warning",
  },
};

export default function StatusModal({
  open,
  type = "success", // success | error | warning
  msg,
  onClose,
  actionLabel = "OK",
}) {
  const config = CONFIG[type];
  if (!config) return null;

  const Icon = config.icon;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <AnimatePresence>
        {open && (
          <DialogContent className="max-w-sm border-none bg-transparent p-0 shadow-none">
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                className={`w-full max-w-sm rounded-2xl border p-6 shadow-xl bg-background`}
                initial={{ opacity: 0, scale: 0.95, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: 8 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
              >
                <DialogTitle className="sr-only">{config.title}</DialogTitle>
                <DialogDescription className="sr-only">{msg}</DialogDescription>

                <div className="flex flex-col items-center gap-4 text-center">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-full border ${config.ring}`}
                  >
                    <Icon className={`h-7 w-7 ${config.iconClass}`} />
                  </div>

                  <div className="space-y-1">
                    <p className="text-lg font-semibold">{config.title}</p>
                    <p className="text-sm text-muted-foreground">{msg}</p>
                  </div>

                  <Button className="mt-2 w-full" onClick={onClose}>
                    {actionLabel}
                  </Button>
                </div>
              </motion.div>
            </div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
