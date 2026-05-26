"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { SITE } from "@/lib/site";

const WHATSAPP_URL = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(SITE.whatsappMessage)}`;

export function WhatsAppButton() {
  const [mounted, setMounted] = useState(false);
  const [showTip, setShowTip] = useState(false);

  // Only render after mount so the SSR markup stays static.
  useEffect(() => {
    setMounted(true);
    // Show the chat bubble tooltip briefly after first paint.
    const t = window.setTimeout(() => setShowTip(true), 1500);
    const h = window.setTimeout(() => setShowTip(false), 7000);
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(h);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-2 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {showTip && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.9 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-w-[220px] rounded-2xl bg-white px-4 py-2.5 text-sm text-brand-navy shadow-soft"
          >
            <p className="leading-snug">
              Chat with us on{" "}
              <span className="font-semibold text-[#25D366]">WhatsApp</span> — we&apos;ll reply fast.
            </p>
            <span className="absolute -bottom-1.5 right-6 h-3 w-3 rotate-45 bg-white" aria-hidden />
            <button
              type="button"
              onClick={() => setShowTip(false)}
              aria-label="Close tooltip"
              className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-brand-navy text-[10px] text-white hover:bg-brand-red transition"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Hally's Way Concept on WhatsApp"
        initial={{ opacity: 0, scale: 0.6, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 220, damping: 18 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="group relative grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_12px_30px_-8px_rgba(37,211,102,0.6)]"
      >
        <span
          aria-hidden
          className="absolute inset-0 rounded-full bg-[#25D366] opacity-50 motion-safe:animate-ping"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          width="28"
          height="28"
          fill="currentColor"
          aria-hidden
          className="relative"
        >
          <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 01-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 01-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035.834 2.722.834.96 0 2.92-.78 2.92-1.97 0-.27-.044-.515-.115-.77-.207-.665-1.69-1.214-1.69-1.214zM16.001 0c-8.836 0-16 7.164-16 16 0 3.092.876 6.083 2.527 8.683L0 32l7.566-2.488A15.93 15.93 0 0016 32c8.836 0 16-7.164 16-16S24.836 0 16 0zm0 29.354c-2.45 0-4.84-.7-6.9-2.02l-.495-.293-5.085 1.67 1.67-4.96-.32-.51A13.31 13.31 0 012.647 16C2.647 8.62 8.62 2.647 16 2.647S29.354 8.62 29.354 16 23.38 29.354 16 29.354z" />
        </svg>
      </motion.a>
    </div>
  );
}
