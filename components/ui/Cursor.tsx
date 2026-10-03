'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

const INTERACTIVE = 'a, button, [role="button"], label, select, [data-cursor]';

/** Desktop-only cursor: a precise dot plus a trailing ring that swells over interactive elements. */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 220, damping: 26, mass: 0.6 });
  const ry = useSpring(y, { stiffness: 220, damping: 26, mass: 0.6 });

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine) and (hover: hover)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!fine.matches || reduce.matches) return;

    setEnabled(true);
    document.documentElement.classList.add('has-cursor');

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const target = (e.target as Element | null)?.closest(INTERACTIVE);
      setHovering(!!target);
      setLabel(target?.getAttribute('data-cursor') ?? null);
    };
    const leave = () => setVisible(false);

    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', leave);
      document.documentElement.classList.remove('has-cursor');
    };
  }, [x, y]);

  if (!enabled) return null;

  const size = label ? 88 : hovering ? 56 : 32;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[120] mix-blend-difference">
      <motion.div
        className="absolute left-0 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ivory"
        style={{ x, y }}
        animate={{ opacity: visible && !label ? 1 : 0 }}
      />
      <motion.div className="absolute left-0 top-0" style={{ x: rx, y: ry }}>
        <motion.div
          className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-ivory/80"
          animate={{
            width: size,
            height: size,
            opacity: visible ? 1 : 0,
            backgroundColor: label ? 'rgba(247,243,236,1)' : 'rgba(247,243,236,0)',
          }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {label && (
            <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-charcoal">{label}</span>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
