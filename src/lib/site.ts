// Single source of truth for brand contact details used across the site
// (footer, contact page, navbar top bar, etc).

export interface SiteLocation {
  label: string;
  address: string;
  city: string;
  state: string;
  country: string;
}

export const SITE = {
  name: "Hally's Way Concept",
  email: "info@hallysway.com",
  // International format for tel: links, plus a friendly display value.
  phone: "+234 906 827 5902",
  phoneTel: "+2349068275902",
  whatsapp: "2349068275902",
  whatsappMessage: "Hello Hally's Way Concept, I'd like to make an enquiry.",
  locations: [
    {
      label: "Airport Arrival",
      address: "Building 02, opp Arrival",
      city: "Muhammadu Buhari International Airport, Maiduguri",
      state: "Borno State",
      country: "Nigeria"
    },
    {
      label: "Airport Departure",
      address: "Shop 05, Departure Hall",
      city: "Muhammadu Buhari International Airport, Maiduguri",
      state: "Borno State",
      country: "Nigeria"
    },
    {
      label: "New Bama Motor Park",
      address: "Shop J17, New Bama Motor Park",
      city: "Maiduguri",
      state: "Borno State",
      country: "Nigeria"
    },
    {
      label: "Abuja",
      address: "Abuja",
      city: "Abuja",
      state: "FCT",
      country: "Nigeria"
    }
  ] as SiteLocation[]
};

export function formatLocation(loc: SiteLocation) {
  return `${loc.address}, ${loc.city}, ${loc.state}, ${loc.country}`;
}
