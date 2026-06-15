// Central config — edit this file to update contact info, hours, and social handles.

export const siteConfig = {
  name: "Chae GPT",
  tagline: "Where Jamshoro sips & studies.",
  description:
    "Jamshoro's boldest chai cafe — right opposite Mehran University. Dine-in, outdoor seating, and delivery.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",

  contact: {
    address:
      "Plot A-306, Jamshoro Society Phase 3, Near The City School, Opposite Mehran University, Jamshoro, Sindh, Pakistan",
    email: "chaigptofficial@gmail.com",
    phone: "+92-300-0000000", // confirm with owner
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3601.8!2d68.276!3d25.428!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDI1JzQwLjgiTiA2OMKwMTYnMzMuNiJF!5e0!3m2!1sen!2spk!4v1700000000000",
  },

  social: {
    instagram: "chaigpt__",
    instagramUrl: "https://instagram.com/chaigpt__",
    tiktok: "_chaigpt_",
    tiktokUrl: "https://tiktok.com/@_chaigpt_",
    facebook: "chaigptofficial",
    facebookUrl: "https://facebook.com/chaigptofficial",
  },

  hours: [
    { day: "Monday – Sunday", time: "11:00 AM – 2:00 AM" }, // confirm with owner
  ],

  services: ["Dine-in", "Outdoor Seating", "Delivery", "Takeaway"],

  // Paste real Instagram/TikTok post URLs here for the social feed section.
  // Format: { platform: "instagram" | "tiktok", url: "https://..." }
  featuredPosts: [
    // { platform: "instagram", url: "https://www.instagram.com/p/EXAMPLE/" },
    // { platform: "tiktok", url: "https://www.tiktok.com/@_chaigpt_/video/EXAMPLE" },
  ] as { platform: "instagram" | "tiktok"; url: string }[],
};

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "Reservations", href: "/reservations" },
  { label: "Contact", href: "/contact" },
];
