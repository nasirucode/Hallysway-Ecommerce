"use client";

import { motion } from "framer-motion";
import { PlayCircle, Quote, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function AirportVisit() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);

  // Pause when the section scrolls fully out of view to avoid background audio.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting && !v.paused) {
            v.pause();
            setPlaying(false);
          }
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(v);
    return () => observer.disconnect();
  }, []);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <section className="container py-20">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="pill">
            <Sparkles className="h-3.5 w-3.5 text-brand-red" />
            A milestone in our journey
          </span>
          <h2 className="mt-4 h-display text-3xl sm:text-4xl lg:text-5xl text-balance">
            MSME Clinic Launching at Borno State Government House, Maiduguri.
          </h2>
          <p className="mt-5 text-brand-navy/75 text-lg leading-relaxed">
            We were proud to take part in the{" "}
            <span className="font-medium text-brand-navy">MSME Clinic Launching</span> hosted at the{" "}
            <span className="font-medium text-brand-navy">
              Borno State Government House, Maiduguri
            </span>{" "}
            — a defining moment for small businesses across the state and the future of
            homegrown Nigerian brands like Hally&apos;s Way Concept.
          </p>

          <blockquote className="mt-8 flex gap-4 rounded-3xl border border-brand-navy/10 bg-white p-5 shadow-soft">
            <Quote className="h-6 w-6 shrink-0 text-brand-red" />
            <p className="text-brand-navy/80 leading-relaxed">
              Every blend, every sachet, every smile is rooted in Borno. To stand among the
              MSMEs shaping our nation&apos;s future is a milestone we&apos;ll always carry with pride.
            </p>
          </blockquote>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24, scale: 0.97 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="relative overflow-hidden rounded-[28px] shadow-soft">
            <video
              ref={videoRef}
              src="/video/vp-visit.mp4"
              poster="/brand/booth.jpg"
              playsInline
              controls
              preload="metadata"
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              className="aspect-[9/16] w-full bg-brand-navy/95 object-cover sm:aspect-video"
            />

            {!playing && (
              <button
                onClick={togglePlay}
                aria-label="Play video"
                className="group absolute inset-0 grid place-items-center bg-gradient-to-b from-brand-navy/30 via-brand-navy/10 to-brand-navy/50 transition hover:from-brand-navy/40 hover:to-brand-navy/60"
              >
                <span className="grid h-20 w-20 place-items-center rounded-full bg-white/95 text-brand-red shadow-glow transition group-hover:scale-110">
                  <PlayCircle className="h-10 w-10" strokeWidth={1.5} />
                </span>
              </button>
            )}
          </div>

          <div className="absolute -left-3 -bottom-3 hidden rounded-2xl bg-white px-4 py-3 shadow-soft sm:block">
            <p className="text-[10px] uppercase tracking-wider text-brand-navy/60">Location</p>
            <p className="font-display text-base text-brand-navy">Government House, Maiduguri</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
