"use client";

import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export type TestimonialItem = {
  text: string;
  image: string;
  name: string;
  role: string;
};

export function TestimonialsColumn(props: {
  className?: string;
  testimonials: TestimonialItem[];
  duration?: number;
}) {
  const { className, testimonials, duration = 10 } = props;

  return (
    <div className={cn("w-full max-w-xs", className)}>
      <motion.div
        animate={{ translateY: "-50%" }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {Array.from({ length: 2 }).map((_, index) => (
          <React.Fragment key={index}>
            {testimonials.map(({ text, image, name, role }) => (
              <article
                key={`${index}-${name}-${role}`}
                className="w-full max-w-xs rounded-3xl border border-[#E7000B]/15 bg-card p-6 shadow-lg shadow-[#E7000B]/8"
              >
                <p className="text-sm leading-relaxed text-foreground">{text}</p>
                <div className="mt-5 flex items-center gap-3">
                  <img
                    width={40}
                    height={40}
                    src={image}
                    alt={name}
                    className="h-10 w-10 rounded-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="flex flex-col">
                    <p className="leading-5 font-medium tracking-tight text-foreground">
                      {name}
                    </p>
                    <p className="leading-5 tracking-tight text-muted-foreground">
                      {role}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
}
