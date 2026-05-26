"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Clock, GraduationCap, Loader2, Send, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { SCHOOL_COURSES } from "@/lib/services-data";

interface Props {
  open: boolean;
  onClose: () => void;
  /** Optional course title to pre-select (e.g. when triggered from a card). */
  initialCourse?: string;
}

interface FormState {
  studentName: string;
  email: string;
  phone: string;
  course: string;
  city: string;
  state: string;
  address: string;
  notes: string;
}

const INITIAL: FormState = {
  studentName: "",
  email: "",
  phone: "",
  course: "",
  city: "",
  state: "Borno",
  address: "",
  notes: ""
};

export function SchoolApplyModal({ open, onClose, initialCourse }: Props) {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  // Group courses by category for a nicer picker layout.
  const grouped = useMemo(() => {
    const map = new Map<string, typeof SCHOOL_COURSES>();
    for (const c of SCHOOL_COURSES) {
      if (!map.has(c.category)) map.set(c.category, []);
      map.get(c.category)!.push(c);
    }
    return Array.from(map.entries());
  }, []);

  useEffect(() => {
    if (!open) return;
    setForm((f) => ({ ...f, course: initialCourse || f.course }));
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, initialCourse, onClose]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.course) {
      toast.error("Please pick a course.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/services/school-apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Could not register");
      setDone(true);
      toast.success("Enrollment received — we'll reach out shortly!");
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleClose() {
    onClose();
    window.setTimeout(() => {
      setDone(false);
      setForm({ ...INITIAL, course: initialCourse || "" });
    }, 300);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] grid place-items-end overflow-y-auto bg-brand-navy/60 backdrop-blur-sm p-4 sm:place-items-center sm:p-6"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-brand-cream shadow-2xl"
          >
            <button
              onClick={handleClose}
              aria-label="Close form"
              className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-white text-brand-navy shadow-soft transition hover:bg-brand-red hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative bg-gradient-to-br from-brand-navy via-brand-navy-600 to-brand-navy-800 px-6 py-7 text-white sm:px-8">
              <div className="absolute inset-0 -z-10 bg-grain opacity-25" />
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-red text-white shadow-glow">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <p className="text-xs uppercase tracking-[0.22em] text-brand-red-200">
                  Hally&apos;s Way School
                </p>
              </div>
              <h3 className="mt-3 font-display text-2xl sm:text-3xl">Enroll for a course</h3>
              <p className="mt-2 max-w-md text-sm text-white/75">
                Pick a course, tell us a little about yourself, and we&apos;ll get back to
                you with the next class start date.
              </p>
            </div>

            <AnimatePresence mode="wait">
              {done ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  className="px-6 py-10 text-center sm:px-10"
                >
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 18 }}
                    className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-green-100 text-green-600"
                  >
                    <CheckCircle2 className="h-9 w-9" />
                  </motion.div>
                  <h4 className="mt-5 font-display text-2xl text-brand-navy">
                    You&apos;re on the list!
                  </h4>
                  <p className="mt-2 text-brand-navy/70">
                    Thanks, {form.studentName.split(" ")[0] || "friend"}. We&apos;ve received
                    your enrollment for{" "}
                    <span className="font-medium text-brand-navy">{form.course}</span>. Our team
                    will reach out at{" "}
                    <span className="font-medium text-brand-navy">{form.email}</span> with the
                    class start date and what to bring.
                  </p>
                  <button onClick={handleClose} className="btn-primary mt-7">
                    Done
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="grid gap-4 p-6 sm:p-8 sm:grid-cols-2"
                >
                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium uppercase tracking-wider text-brand-navy/60">
                      Pick a course <span className="text-brand-red">*</span>
                    </label>
                    <div className="mt-2 grid gap-4">
                      {grouped.map(([category, courses]) => (
                        <div key={category}>
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-navy/50">
                            {category}
                          </p>
                          <div className="mt-2 grid gap-2 sm:grid-cols-2">
                            {courses.map((c) => {
                              const active = form.course === c.title;
                              return (
                                <button
                                  key={c.title}
                                  type="button"
                                  onClick={() => update("course", c.title)}
                                  className={
                                    "group relative overflow-hidden rounded-2xl border p-3 text-left transition " +
                                    (active
                                      ? "border-brand-red bg-brand-red/5 shadow-glow"
                                      : "border-brand-navy/10 bg-white hover:border-brand-red/40")
                                  }
                                >
                                  <div className="flex items-start justify-between gap-2">
                                    <p
                                      className={
                                        "text-sm font-medium " +
                                        (active ? "text-brand-red" : "text-brand-navy")
                                      }
                                    >
                                      {c.title}
                                    </p>
                                    <span
                                      className={
                                        "shrink-0 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium " +
                                        (active
                                          ? "bg-brand-red text-white"
                                          : "bg-brand-navy/5 text-brand-navy/70")
                                      }
                                    >
                                      <Clock className="h-3 w-3" />
                                      {c.duration}
                                    </span>
                                  </div>
                                  <p className="mt-1 text-xs text-brand-navy/60 leading-snug">
                                    {c.description}
                                  </p>
                                  {active && (
                                    <motion.span
                                      layoutId="course-radio"
                                      className="absolute inset-0 -z-10 rounded-2xl bg-brand-red/5"
                                      transition={{
                                        type: "spring",
                                        stiffness: 380,
                                        damping: 30
                                      }}
                                    />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium uppercase tracking-wider text-brand-navy/60">
                      Full name
                    </label>
                    <input
                      required
                      value={form.studentName}
                      onChange={(e) => update("studentName", e.target.value)}
                      placeholder="Your full name"
                      className="input mt-1.5"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium uppercase tracking-wider text-brand-navy/60">
                      Email
                    </label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder="you@example.com"
                      className="input mt-1.5"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium uppercase tracking-wider text-brand-navy/60">
                      Phone
                    </label>
                    <input
                      required
                      type="tel"
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      placeholder="+234 800 000 0000"
                      className="input mt-1.5"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium uppercase tracking-wider text-brand-navy/60">
                      Address (optional)
                    </label>
                    <input
                      value={form.address}
                      onChange={(e) => update("address", e.target.value)}
                      placeholder="Street, building"
                      className="input mt-1.5"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium uppercase tracking-wider text-brand-navy/60">
                      City
                    </label>
                    <input
                      required
                      value={form.city}
                      onChange={(e) => update("city", e.target.value)}
                      placeholder="Maiduguri"
                      className="input mt-1.5"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium uppercase tracking-wider text-brand-navy/60">
                      State
                    </label>
                    <input
                      required
                      value={form.state}
                      onChange={(e) => update("state", e.target.value)}
                      placeholder="Borno"
                      className="input mt-1.5"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium uppercase tracking-wider text-brand-navy/60">
                      Anything else? (optional)
                    </label>
                    <textarea
                      value={form.notes}
                      onChange={(e) => update("notes", e.target.value)}
                      placeholder="Previous experience, preferred start date, etc."
                      rows={3}
                      className="input mt-1.5"
                    />
                  </div>

                  <div className="sm:col-span-2 mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-brand-navy/60">
                      We&apos;ll save your enrollment and email you when the next cohort starts.
                    </p>
                    <button
                      type="submit"
                      disabled={submitting || !form.course}
                      className="btn-primary px-6 py-3 disabled:opacity-60"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                        </>
                      ) : (
                        <>
                          Enroll now <Send className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
