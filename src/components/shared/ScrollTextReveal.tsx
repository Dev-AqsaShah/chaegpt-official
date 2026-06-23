"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

const HIGHLIGHT_AMBER = "#E8A33D";

function cleanWord(word: string) {
  return word.toLowerCase().replace(/[.,!?;:]/g, "");
}

interface WordProps {
  word: string;
  range: [number, number];
  progress: MotionValue<number>;
  reduceMotion: boolean;
  highlight: boolean;
}

function Word({ word, range, progress, reduceMotion, highlight }: WordProps) {
  const opacity = useTransform(progress, range, [0.15, 1]);

  return (
    <>
      <motion.span
        style={{
          opacity: reduceMotion ? 1 : opacity,
          color: highlight ? HIGHLIGHT_AMBER : undefined,
        }}
        className={cn("inline-block", highlight && "font-semibold")}
      >
        {word}
      </motion.span>{" "}
    </>
  );
}

interface ScrollTextRevealProps {
  text: string;
  highlightWords?: string[];
  className?: string;
}

export function ScrollTextReveal({ text, highlightWords = [], className }: ScrollTextRevealProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "start 0.25"],
  });

  const words = text.split(" ");
  const highlightSet = new Set(highlightWords.map(cleanWord));

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <Word
          key={`${word}-${i}`}
          word={word}
          range={[i / words.length, (i + 1) / words.length]}
          progress={scrollYProgress}
          reduceMotion={!!reduceMotion}
          highlight={highlightSet.has(cleanWord(word))}
        />
      ))}
    </p>
  );
}
