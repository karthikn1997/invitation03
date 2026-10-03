'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { ease } from '@/lib/motion';

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  blur?: boolean;
  amount?: number;
  duration?: number;
};

/** Fade + rise + blur-to-sharp, once, as the element enters the viewport. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 36,
  blur = true,
  amount = 0.3,
  duration = 1.4,
}: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: blur ? 'blur(10px)' : 'blur(0px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount }}
      transition={{ duration, ease, delay }}
    >
      {children}
    </motion.div>
  );
}
