"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
  bodyScrollable = true,
  mobilePlacement = "bottom",
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
  bodyScrollable?: boolean;
  mobilePlacement?: "bottom" | "center";
}) {
  const [mounted, setMounted] = useState(false);
  const shellRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const root = shellRef.current;
      if (!root) return;

      const focusable = root.querySelectorAll<HTMLElement>(
        [
          "a[href]",
          "button:not([disabled])",
          "input:not([disabled])",
          "select:not([disabled])",
          "textarea:not([disabled])",
          "[tabindex]:not([tabindex='-1'])",
        ].join(","),
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    const previousActive = document.activeElement as HTMLElement | null;
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
      if (!closeButtonRef.current) {
        shellRef.current?.focus();
      }
    });

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previousActive?.focus?.();
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className={cn(
            "fixed inset-0 z-[100] flex justify-center p-0 sm:p-4",
            mobilePlacement === "center" ? "items-center" : "items-end sm:items-center",
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            ref={shellRef}
            tabIndex={-1}
            className={cn(
              "glass-strong glow-soft relative z-10 flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-[26px] border border-border-strong sm:max-w-lg sm:rounded-[26px]",
              shellClassName,
            )}
            initial={{ y: 24, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
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
                  ref={closeButtonRef}
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
                "min-h-0 flex-1 p-5",
                bodyScrollable ? "overflow-y-auto" : "overflow-hidden",
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
