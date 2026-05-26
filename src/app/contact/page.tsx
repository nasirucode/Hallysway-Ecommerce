"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { SITE, formatLocation } from "@/lib/site";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  return (
    <section className="container py-14">
      <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="eyebrow">Get in touch</p>
          <h1 className="mt-3 h-display text-4xl sm:text-5xl text-balance">
            We&apos;d love to hear from you.
          </h1>
          <p className="mt-4 max-w-md text-brand-navy/70">
            Questions about our blends, catering bookings or wholesale enquiries — we typically respond within a few hours.
          </p>

          <div className="mt-10 space-y-3">
            <motion.a
              href={`tel:${SITE.phoneTel}`}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-soft hover:shadow-glow transition"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-red/10 text-brand-red">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-brand-navy/60">Call us</p>
                <p className="font-medium">{SITE.phone}</p>
              </div>
            </motion.a>
            <motion.a
              href={`mailto:${SITE.email}`}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-soft hover:shadow-glow transition"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-red/10 text-brand-red">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-brand-navy/60">Email</p>
                <p className="font-medium">{SITE.email}</p>
              </div>
            </motion.a>
          </div>

          <div className="mt-10">
            <p className="eyebrow">Our Locations</p>
            <h2 className="mt-2 font-display text-2xl text-brand-navy">Find us in person</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {SITE.locations.map((loc, i) => (
                <motion.div
                  key={loc.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="flex gap-3 rounded-2xl bg-white p-4 shadow-soft"
                >
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-navy/10 text-brand-navy">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-brand-navy">{loc.label}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-brand-navy/70">
                      {formatLocation(loc)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="rounded-3xl bg-white p-7 shadow-soft lg:sticky lg:top-28"
          onSubmit={(e) => {
            e.preventDefault();
            setLoading(true);
            setTimeout(() => {
              toast.success("Message sent — we'll get back to you soon!");
              (e.target as HTMLFormElement).reset();
              setLoading(false);
            }, 700);
          }}
        >
          <h2 className="font-display text-2xl">Send a message</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <input required name="name" placeholder="Your name" className="input sm:col-span-2" />
            <input required name="email" type="email" placeholder="Email" className="input" />
            <input name="phone" placeholder="Phone (optional)" className="input" />
            <select required name="subject" defaultValue="" className="input sm:col-span-2">
              <option value="" disabled>
                What is your enquiry about?
              </option>
              <option>Tea & Spice products</option>
              <option>Catering booking</option>
              <option>Wholesale partnership</option>
              <option>Other</option>
            </select>
            <textarea required name="message" placeholder="Tell us a bit more..." rows={5} className="input sm:col-span-2" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary mt-5 w-full py-3.5 disabled:opacity-60">
            {loading ? "Sending..." : "Send message"}
            <Send className="h-4 w-4" />
          </button>
        </motion.form>
      </div>
    </section>
  );
}
