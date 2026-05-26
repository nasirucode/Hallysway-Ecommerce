import Image from "next/image";
import { Story } from "@/components/home/Story";
import { Testimonials } from "@/components/home/Testimonials";
import { ShopHeader } from "@/components/shop/ShopHeader";

export const metadata = {
  title: "Our Story",
  description: "Get to know Hally's Way Concept — hand-mixed natural blends, catering and fashion."
};

const SERVICES = [
  {
    title: "Tea & Spice Pantry",
    desc: "Hand-mixed teas and signature spices, packaged with care.",
    image: "/products/hally-tea-blend.jpg"
  },
  {
    title: "Catering Service",
    desc: "End-to-end catering for weddings, conferences and intimate events.",
    image: "/brand/booth.jpg"
  },
  {
    title: "Event Planning & Fashion",
    desc: "Beautifully styled events and African-inspired fashion design.",
    image: "/lifestyle/cozy-mug.jpg"
  }
];

export default function AboutPage() {
  return (
    <>
      <ShopHeader
        title="Crafting joyful rituals, the Hally's Way."
        description="Born in Maiduguri, made for the world — Hally's Way Concept is a wellness, catering and lifestyle brand committed to natural ingredients and warm hospitality."
      />
      <Story />

      <section id="catering" className="container py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {SERVICES.map((s) => (
            <article key={s.title} className="group relative overflow-hidden rounded-3xl bg-white shadow-soft">
              <div className="relative aspect-[4/3]">
                <Image src={s.image} alt={s.title} fill sizes="(max-width: 768px) 90vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl">{s.title}</h3>
                <p className="mt-1 text-sm text-brand-navy/70">{s.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Testimonials />
    </>
  );
}
