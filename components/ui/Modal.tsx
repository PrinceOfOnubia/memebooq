"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export function Modal({
  open,
  onClose,
  children,
  title,
  footer,
  showHeader = true,
  shellClassName,
  headerClassName,
  bodyClassName,
  footerClassName,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  /** Pinned action area that never scrolls — stays visible at the bottom. */
  footer?: React.ReactNode;
  showHeader?: boolean;
  shellClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className={cn(
              "glass-strong glow-soft relative z-10 flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-[26px] border border-border-strong sm:max-w-lg sm:rounded-[26px]",
              shellClassName,
            )}
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
          >
            {showHeader ? (
              <div
                className={cn(
                  "flex shrink-0 items-center justify-between border-b border-border bg-bg-2/70 px-5 py-4 backdrop-blur",
                  headerClassName,
                )}
              >
                <h3 className="font-display text-lg font-semibold">{title}</h3>
                <button
                  onClick={onClose}
                  className="grid h-8 w-8 place-items-center rounded-full text-faint transition-colors hover:bg-surface-2 hover:text-text"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              title && <h3 className="sr-only">{title}</h3>
            )}

            <div
              className={cn(
                "min-h-0 flex-1 overflow-y-auto p-5",
                footer ? "" : "pb-[max(1.25rem,env(safe-area-inset-bottom))]",
                bodyClassName,
              )}
            >
              {children}
            </div>

            {footer && (
              <div
                className={cn(
                  "shrink-0 border-t border-border bg-bg-2/70 px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur",
                  footerClassName,
                )}
              >
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
