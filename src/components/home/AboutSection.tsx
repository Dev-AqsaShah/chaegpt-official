"use client";

import { motion } from "framer-motion";
import { Coffee, Users, Truck, Armchair } from "lucide-react";

const features = [
  { icon: Coffee, title: "Craft Chai", desc: "Every chai brewed fresh — from Doodh Patti to Kashmiri Pink." },
  { icon: Users, title: "Student Friendly", desc: "Right opposite Mehran University. Your campus hangout." },
  { icon: Truck, title: "Fast Delivery", desc: "Hot food at your door. Delivery across Jamshoro." },
  { icon: Armchair, title: "Outdoor Seating", desc: "Chill outside under the sky. Perfect for group study sessions." },
];

export function AboutSection() {
  return (
    <section className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-5xl font-black uppercase leading-tight">
              Not just a cafe.
              <br />
              <span className="text-primary">A whole vibe.</span>
            </h2>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
              Chae GPT opened right opposite Mehran University because we believe the best
              ideas — and the best chai — happen together. Whether you're cramming before
              exams, meeting friends, or just need a break, we've got a seat for you.
            </p>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Bold flavours, original recipes, and an energy that keeps Jamshoro buzzing
              from 11 AM to 2 AM — every single day.
            </p>
          </motion.div>

          {/* Feature grid */}
          <div className="grid grid-cols-2 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="rounded-xl border border-border/50 bg-card p-5 hover:border-primary/40 transition-colors"
              >
                <f.icon className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
