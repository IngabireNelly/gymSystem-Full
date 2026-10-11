import React, { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { XIcon } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}

const ease = [0.23, 1, 0.32, 1] as const;

export function Modal({ open, onClose, eyebrow, title, children }: ModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open &&
      <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6">
          <motion.div
          aria-hidden="true"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease }}
          className="absolute inset-0 bg-ink/60" />
        
          <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.25, ease }}
          className="relative flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-t-3xl bg-paper shadow-2xl sm:rounded-3xl">
          
            <header className="flex items-start justify-between gap-4 border-b border-ink/10 px-6 pb-5 pt-6 sm:px-8">
              <div>
                <p className="font-serif text-base font-semibold uppercase tracking-[0.2em] text-gold">
                  {eyebrow}
                </p>
                <h2
                id="modal-title"
                className="mt-1 font-display text-3xl uppercase leading-none text-ink sm:text-4xl">
                
                  {title}
                </h2>
              </div>
              <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/20 text-ink transition-[background-color,color,transform] duration-150 hover:bg-ink hover:text-paper active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">
              
                <XIcon className="h-4 w-4" />
              </button>
            </header>
            <div className="overflow-y-auto px-6 py-6 sm:px-8 sm:py-8">{children}</div>
          </motion.div>
        </div>
      }
    </AnimatePresence>);

}