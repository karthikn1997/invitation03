'use client';

import { motion } from 'framer-motion';
import clsx from 'clsx';
import type { ElementType, ReactNode } from 'react';
import { ease } from '@/lib/motion';

type SplitLinesProps = {
  lines: ReactNode[];
  as?: ElementType;
  className?: string;
  lineClassName?: (index: number) => string | undefined;
  delay?: number;
  stagger?: number;
  duration?: number;
  /** When provided, animation is controlled externally instead of by viewport. */
  play?: boolean;
  amount?: number;
};

/** Masked line-by-line reveal: each line slides up from behind its own clip. */
export function SplitLines({
  lines,
  as: Tag = 'div',
  className,
  lineClassName,
  delay = 0,
  stagger = 0.12,
  duration = 1.3,
  play,
  amount = 0.5,
}: SplitLinesProps) {
  const control =
    play === undefined
      ? { initial: 'hidden', whileInView: 'show', viewport: { once: true, amount } }
      : { initial: 'hidden', animate: play ? 'show' : 'hidden' };

  return (
    <Tag className={className}>
      <motion.span className="block" {...control}>
        {lines.map((line, i) => (
          <span key={i} className="-mb-[0.12em] block overflow-hidden pb-[0.12em] pr-[0.08em]">
            <motion.span
              className={clsx('block will-change-transform', lineClassName?.(i))}
              variants={{
                hidden: { y: '115%' },
                show: { y: '0%', transition: { duration, ease, delay: delay + i * stagger } },
              }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
