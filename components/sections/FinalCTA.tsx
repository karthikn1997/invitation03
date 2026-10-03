'use client';

import Image from 'next/image';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Reveal } from '@/components/motion/Reveal';
import { SplitLines } from '@/components/motion/SplitLines';
import { couple } from '@/lib/content';
import { img } from '@/lib/images';

export function FinalCTA() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-18%', '0%']);
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1.18, 1]);
  const shade = useTransform(scrollYProgress, [0, 1], [0.75, 0.38]);

  return (
    <section
      ref={ref}
      aria-label="See you at the altar"
      className="relative h-[100svh] min-h-[600px] overflow-hidden bg-charcoal text-ivory"
    >
      <motion.div className="absolute inset-0 will-change-transform" style={{ y, scale }}>
        <Image
          src={img.final}
          alt="Arjun and Meera sitting together in tall grass by the river"
          fill
          sizes="100vw"
          placeholder="blur"
          className="object-cover object-[42%_45%]"
        />
      </motion.div>
      <motion.div aria-hidden className="absolute inset-0 bg-charcoal" style={{ opacity: shade }} />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-charcoal/30" />
      <div aria-hidden className="absolute inset-0 hidden bg-gradient-to-l from-charcoal/60 via-charcoal/10 to-transparent md:block" />

      {/* Type sits clear of the couple: anchored low on phones, to the right on larger screens. */}
      <div className="gutter relative flex h-full flex-col items-center justify-end pb-[12vh] text-center md:items-end md:justify-center md:pb-0 md:pr-[7vw] md:text-right">
        <Reveal amount={0.8}>
          <p className="label text-ivory/80">See you at the altar</p>
        </Reveal>
        <SplitLines
          as="h2"
          className="display mt-8 text-[clamp(4rem,19vw,7rem)] md:text-[clamp(5rem,9vw,10rem)]"
          lines={[
            <>
              {couple.groom} <span className="italic text-champagne">&amp;</span>
            </>,
            couple.bride,
          ]}
          lineClassName={(i) => (i === 1 ? 'md:pr-[0.6em]' : undefined)}
          stagger={0.18}
          duration={1.6}
        />
        <Reveal delay={0.5} amount={0.8}>
          <p className="nums mt-10 font-serif text-2xl font-light tracking-[0.3em] md:text-3xl">{couple.dateDots}</p>
        </Reveal>
      </div>
    </section>
  );
}
