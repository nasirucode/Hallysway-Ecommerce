// Single source of truth for the /services page. Each entry powers a card on
// the page, ordered top-to-bottom. The `services` strings double as the
// options shown in the School application form's "services of interest"
// multi-select, so adding a new service here surfaces everywhere.

import type { LucideIcon } from "lucide-react";
import {
  ChefHat,
  CalendarHeart,
  Sparkles,
  Boxes,
  Scissors,
  Gem,
  Wand2,
  Flame,
  Heart,
  Brush,
  Globe,
  GraduationCap,
  Megaphone,
  Users,
  Lightbulb,
  School
} from "lucide-react";

export interface ServiceItem {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface ServiceCategory {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  accent: "navy" | "red" | "gold" | "green";
  services: ServiceItem[];
  cta?: {
    label: string;
    type: "school-apply" | "contact";
  };
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "catering",
    eyebrow: "Catering & Hospitality",
    title: "Delicious moments, delivered.",
    description:
      "From intimate gatherings to large conferences, our team handles every culinary and hospitality detail with care.",
    image: "/services/catering.jpg",
    accent: "red",
    services: [
      {
        title: "Catering Services",
        description:
          "Full-service catering for weddings, corporate events and family gatherings.",
        icon: ChefHat
      },
      {
        title: "Event Planning",
        description:
          "End-to-end event design, coordination, vendor management and on-the-day execution.",
        icon: CalendarHeart
      },
      {
        title: "Janitorial Services",
        description:
          "Professional cleaning and fumigation for homes, offices and event venues.",
        icon: Sparkles
      },
      {
        title: "Supply of Non-Food Items",
        description:
          "Sourcing and supply of consumables, packaging and hospitality essentials.",
        icon: Boxes
      }
    ]
  },
  {
    id: "fashion",
    eyebrow: "Fashion & Beauty",
    title: "Craftsmanship that turns heads.",
    description:
      "African-rooted fashion, accessories and beauty rituals — all hand-finished with love.",
    image: "/services/fashion.jpg",
    accent: "gold",
    services: [
      {
        title: "Fashion Design",
        description:
          "Bespoke clothing, agbada, kaftans and ready-to-wear collections.",
        icon: Scissors
      },
      {
        title: "Beads Making",
        description:
          "Handcrafted bead jewellery and accessories for every occasion.",
        icon: Gem
      },
      {
        title: "Herma (Hair Accessories)",
        description:
          "Original hair accessories that complete your signature look.",
        icon: Wand2
      },
      {
        title: "Scent (Turaren Wuta, Khumrah)",
        description:
          "Traditional incense and perfumed essentials, blended in small batches.",
        icon: Flame
      },
      {
        title: "Body Waxing",
        description:
          "Premium body waxing service in a clean, calming environment.",
        icon: Heart
      },
      {
        title: "Hair Styling",
        description:
          "Modern and classic styling — braids, twists, blowouts and more.",
        icon: Brush
      }
    ]
  },
  {
    id: "tech",
    eyebrow: "Information Technology",
    title: "Digital solutions that grow your brand.",
    description:
      "We help businesses, schools and creators build a confident, modern digital presence.",
    image: "/services/tech.jpg",
    accent: "navy",
    services: [
      {
        title: "Website Design",
        description:
          "Beautiful, fast websites tailored to your brand and audience.",
        icon: Globe
      },
      {
        title: "IT Training",
        description:
          "Practical, hands-on training in digital skills and productivity tools.",
        icon: GraduationCap
      },
      {
        title: "Social Media Awareness Campaign",
        description:
          "Campaign strategy, content production and community engagement.",
        icon: Megaphone
      }
    ]
  },
  {
    id: "community",
    eyebrow: "Community Development",
    title: "Empowering people, building futures.",
    description:
      "Programs designed to lift communities through training, mentorship and public engagement.",
    image: "/services/community.jpg",
    accent: "green",
    services: [
      {
        title: "Capacity Building",
        description:
          "Tailored skill-building programs for cooperatives, MSMEs and NGOs.",
        icon: Users
      },
      {
        title: "Public Enlightenment",
        description:
          "Outreach campaigns that inform, educate and inspire positive action.",
        icon: Lightbulb
      }
    ]
  },
  {
    id: "school",
    eyebrow: "Hally's Way School",
    title: "Learn a craft. Build a future.",
    description:
      "Our hands-on training school equips young Nigerians with practical skills in catering, fashion, beauty, IT and community work. Register for a course below — classes run in cohorts throughout the year.",
    image: "/services/school.jpg",
    accent: "red",
    services: [
      {
        title: "Skills-first training",
        description:
          "Every course is hands-on and practical — you leave with finished work, not just notes.",
        icon: GraduationCap
      },
      {
        title: "Small cohorts",
        description:
          "Intimate class sizes so our trainers can give you direct, personal feedback.",
        icon: Users
      },
      {
        title: "Certificates of completion",
        description:
          "Earn a Hally's Way Concept certificate to add to your CV or portfolio.",
        icon: School
      },
      {
        title: "Career & business support",
        description:
          "Tap into our network for internships, freelance gigs and business launches.",
        icon: Lightbulb
      }
    ],
    cta: { label: "Enroll for a Course", type: "school-apply" }
  }
];

// Flat list of all service titles — used by the school application form's
// "services you're interested in" multi-select.
export const ALL_SERVICE_TITLES: string[] = SERVICE_CATEGORIES.flatMap((c) =>
  c.services.map((s) => s.title)
);

// -----------------------------------------------------------------------
// Hally's Way School — course catalog
// -----------------------------------------------------------------------
// Each course represents a training programme students can enroll in via
// the course-registration form. The `title` strings are surfaced in the
// form's course picker and saved to ERPNext alongside the customer.

export interface SchoolCourse {
  title: string;
  category: string;
  duration: string;
  description: string;
}

export const SCHOOL_COURSES: SchoolCourse[] = [
  {
    title: "Professional Catering",
    category: "Catering & Hospitality",
    duration: "8 weeks",
    description: "Commercial cooking, menu planning, plating and food safety."
  },
  {
    title: "Event Planning & Coordination",
    category: "Catering & Hospitality",
    duration: "6 weeks",
    description: "Plan, budget and run weddings, conferences and private events."
  },
  {
    title: "Janitorial & Fumigation Certification",
    category: "Catering & Hospitality",
    duration: "4 weeks",
    description: "Professional cleaning, sanitation and safe fumigation practice."
  },
  {
    title: "Fashion Design",
    category: "Fashion & Beauty",
    duration: "12 weeks",
    description: "Pattern cutting, sewing, finishing and starting your own label."
  },
  {
    title: "Beads Making",
    category: "Fashion & Beauty",
    duration: "4 weeks",
    description: "Design and assemble jewellery and accessories using local beads."
  },
  {
    title: "Hair Accessories (Herma) Crafting",
    category: "Fashion & Beauty",
    duration: "3 weeks",
    description: "Create signature hair accessories ready for retail."
  },
  {
    title: "Perfumery (Turaren Wuta & Khumrah)",
    category: "Fashion & Beauty",
    duration: "4 weeks",
    description: "Blend traditional incense and oil perfumes from raw ingredients."
  },
  {
    title: "Body Waxing Techniques",
    category: "Fashion & Beauty",
    duration: "2 weeks",
    description: "Hygiene, hair-removal techniques and client care for waxing pros."
  },
  {
    title: "Hair Styling",
    category: "Fashion & Beauty",
    duration: "6 weeks",
    description: "Braids, twists, blowouts and modern salon styling."
  },
  {
    title: "Website Design",
    category: "Information Technology",
    duration: "8 weeks",
    description: "Design and build modern, responsive websites from scratch."
  },
  {
    title: "IT Skills Training",
    category: "Information Technology",
    duration: "6 weeks",
    description: "Computer literacy, Microsoft Office and productivity tools."
  },
  {
    title: "Social Media & Digital Marketing",
    category: "Information Technology",
    duration: "4 weeks",
    description: "Content creation, paid campaigns and growing an online audience."
  }
];

export const SCHOOL_COURSE_TITLES: string[] = SCHOOL_COURSES.map((c) => c.title);
