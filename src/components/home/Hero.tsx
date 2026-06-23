"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, MapPin, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollTextReveal } from "@/components/shared/ScrollTextReveal";

const slides = [
  { src: "/gallery-1.jpg", alt: "Chae GPT outdoor seating at dusk under string lights" },
  { src: "/gallery-3.jpg", alt: "Chae GPT rooftop seating glowing at dusk" },
  { src: "/gallery-4.jpg", alt: "Bamboo pendant lanterns over Chae GPT tables" },
  { src: "/gallery-2.jpg", alt: "Hanging swing chairs in the Chae GPT garden seating" },
];

const AUTOPLAY_MS = 6000;

const ease = [0.16, 1, 0.3, 1] as const;

const headlineWords = ["Where", "Jamshoro", "sips", "&", "studies."];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.3 } },
};

const wordVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

export function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative h-[92vh] min-h-[640px] w-full overflow-hidden bg-black">
      {/* Ken Burns crossfade background */}
      <AnimatePresence>
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1.12 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 1.2, ease: "easeInOut" },
            scale: { duration: AUTOPLAY_MS / 1000 + 1.2, ease: "linear" },
          }}
          className="absolute inset-0"
        >
          <Image
            src={slides[index].src}
            alt={slides[index].alt}
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Cinematic overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />

      {/* Floating glow accents */}
      <div className="animated-bg-blob-a absolute -top-20 right-10 h-72 w-72 rounded-full bg-primary/25 blur-3xl" />
      <div className="animated-bg-blob-b absolute bottom-10 left-10 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />

      {/* Content */}
      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
          <div className="max-w-3xl">
            <motion.div
              initial="hidden"
              animate="show"
              variants={fadeUp}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm"
            >
              <MapPin className="h-3.5 w-3.5 text-primary" />
              Opposite Mehran University, Jamshoro
            </motion.div>

            <motion.h1
              initial="hidden"
              animate="show"
              variants={containerVariants}
              className="font-display text-6xl font-black uppercase leading-[0.95] tracking-tight text-white md:text-8xl"
            >
              {headlineWords.map((word, i) => (
                <motion.span
                  key={word + i}
                  variants={wordVariants}
                  className={
                    "mr-4 inline-block " +
                    (word === "Jamshoro" || word === "studies." ? "text-primary" : "")
                  }
                >
                  {word}
                </motion.span>
              ))}
            </motion.h1>

            <motion.div
              initial="hidden"
              animate="show"
              variants={fadeUp}
              transition={{ delay: 0.9 }}
              className="mt-6 max-w-xl"
            >
              <ScrollTextReveal
                text="Jamshoro's boldest chai cafe — bold desi flavours, heist-level energy, and student-friendly prices. Dine-in, outdoor seating, or delivery."
                highlightWords={["chai", "Jamshoro's", "ChaiGPT"]}
                className="text-lg text-white/80"
              />
            </motion.div>

            <motion.div
              initial="hidden"
              animate="show"
              variants={fadeUp}
              transition={{ delay: 1.05 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Button size="lg" className="gap-2 text-base shadow-lg shadow-primary/30" asChild>
                <Link href="/menu">
                  Order Now <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 border-white/30 bg-white/5 text-base text-white backdrop-blur-sm hover:bg-white/15 hover:text-white"
                asChild
              >
                <Link href="/reservations">Book a Table</Link>
              </Button>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="show"
              variants={fadeUp}
              transition={{ delay: 1.2 }}
              className="mt-12 flex flex-wrap gap-8 border-t border-white/20 pt-8"
            >
              {[
                { value: "30+", label: "Menu Items" },
                { value: "500+", label: "Happy Students" },
                { value: "11 AM", label: "Open Till 2 AM" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-display text-3xl font-black text-primary">{stat.value}</p>
                  <p className="text-sm text-white/70">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-6 right-6 z-20 flex gap-2">
        {slides.map((s, i) => (
          <button
            key={s.src}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-7 bg-primary" : "w-1.5 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>

      {/* Scroll cue */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 text-white/70"
      >
        <ChevronDown className="h-6 w-6" />
      </motion.div>
    </section>
  );
}
