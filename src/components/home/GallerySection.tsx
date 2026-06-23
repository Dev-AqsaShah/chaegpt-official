"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ScrollTextReveal } from "@/components/shared/ScrollTextReveal";

const photos = [
  { src: "/gallery-1.jpg", alt: "Chae GPT outdoor seating at dusk under string lights" },
  { src: "/gallery-2.jpg", alt: "Hanging swing chairs in the Chae GPT garden seating" },
  { src: "/gallery-3.jpg", alt: "Chae GPT rooftop seating glowing at dusk" },
  { src: "/gallery-4.jpg", alt: "Bamboo pendant lanterns over Chae GPT tables" },
  { src: "/gallery-5.jpg", alt: "Pizza, fries, and sandwiches spread at Chae GPT" },
];

export function GallerySection() {
  const featuredRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: featuredRef,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section className="py-20 bg-card overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-10 text-center">
          <h2 className="font-display text-4xl font-black uppercase text-primary">
            The Vibe, In Pictures
          </h2>
          <ScrollTextReveal
            text="String lights, swing chairs, and the kind of food spread Jamshoro keeps coming back for."
            highlightWords={["Jamshoro"]}
            className="mt-2 text-muted-foreground"
          />
        </div>

        {/* Featured photo with scroll parallax */}
        <div
          ref={featuredRef}
          className="relative h-[340px] md:h-[480px] overflow-hidden rounded-2xl"
        >
          <motion.div style={{ y: parallaxY }} className="absolute inset-0 scale-110">
            <Image
              src={photos[0].src}
              alt={photos[0].alt}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>

        {/* Smaller photos */}
        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
          {photos.slice(1).map((photo, i) => (
            <motion.div
              key={photo.src}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative h-[180px] overflow-hidden rounded-2xl md:h-[220px]"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
