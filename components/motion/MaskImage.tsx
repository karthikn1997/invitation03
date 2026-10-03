'use client';

import Image, { type StaticImageData } from 'next/image';
import clsx from 'clsx';
import { useRef, type PointerEvent } from 'react';
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { ease, easeInOut } from '@/lib/motion';

const clipFrom = {
  up: 'inset(100% 0% 0% 0%)',
  down: 'inset(0% 0% 100% 0%)',
  left: 'inset(0% 0% 0% 100%)',
  right: 'inset(0% 100% 0% 0%)',
  center: 'inset(18% 18% 18% 18%)',
} as const;

type MaskImageProps = {
  src: StaticImageData;
  alt: string;
  sizes: string;
  className?: string;
  imageClassName?: string;
  /** Vertical parallax travel as a percentage of the frame height. 0 disables. */
  parallax?: number;
  direction?: keyof typeof clipFrom;
  delay?: number;
  priority?: boolean;
  /** Image drifts gently toward the pointer on hover (desktop). */
  hoverShift?: boolean;
  hoverZoom?: boolean;
};

/**
 * Editorial image: clip-path mask reveal, settling scale, scroll parallax and
 * optional hover drift. The frame is the element that receives `className`.
 */
export function MaskImage({
  src,
  alt,
  sizes,
  className,
  imageClassName,
  parallax = 8,
  direction = 'up',
  delay = 0,
  priority,
  hoverShift,
  hoverZoom = true,
}: MaskImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const travel = reduce ? 0 : parallax;

  // Observe the unclipped frame — a fully clipped element never reports as visible.
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  // Inner layer is (100 + 2·travel)% tall; keep the shift within its overflow.
  const limit = (travel / (100 + 2 * travel)) * 100;
  const y = useTransform(scrollYProgress, [0, 1], [`-${limit}%`, `${limit}%`]);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18, mass: 0.8 });
  const sy = useSpring(my, { stiffness: 60, damping: 18, mass: 0.8 });

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!hoverShift || reduce || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width - 0.5) * -18);
    my.set(((e.clientY - r.top) / r.height - 0.5) * -18);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <div
      ref={ref}
      className={clsx('group relative', className)}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <motion.div
        className="absolute inset-0 overflow-hidden bg-sand"
        initial={{ clipPath: clipFrom[direction] }}
        animate={inView ? { clipPath: 'inset(0% 0% 0% 0%)' } : undefined}
        transition={{ duration: 1.6, ease: easeInOut, delay }}
      >
        <motion.div
          className="absolute inset-x-0 will-change-transform"
          style={{ y, top: `-${travel}%`, bottom: `-${travel}%` }}
        >
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.25 }}
            animate={inView ? { scale: 1 } : undefined}
            transition={{ duration: 2.4, ease, delay }}
          >
            <motion.div className="absolute inset-0" style={{ x: sx, y: sy }}>
              <Image
                src={src}
                alt={alt}
                fill
                sizes={sizes}
                priority={priority}
                placeholder="blur"
                className={clsx(
                  'object-cover transition-transform duration-[1600ms] ease-lux',
                  hoverZoom && 'group-hover:scale-[1.06]',
                  imageClassName,
                )}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
