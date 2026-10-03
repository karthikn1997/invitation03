'use client';

import { getImageProps } from 'next/image';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { useRef } from 'react';
import { useLoader } from '@/components/providers/Providers';
import { img } from '@/lib/images';
import { couple } from '@/lib/content';
import { ease, easeInOut } from '@/lib/motion';
import { scrollToTarget } from '@/lib/scroll';

/** Each word sits in its own mask; letters rise in a slow stagger. */
function Word({ text, delay, play, className }: { text: string; delay: number; play: boolean; className?: string }) {
  return (
    <span className={`inline-block overflow-hidden pb-[0.1em] pr-[0.04em] align-bottom ${className ?? ''}`}>
      {text.split('').map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block will-change-transform"
          initial={{ y: '110%' }}
          animate={play ? { y: '0%' } : undefined}
          transition={{ duration: 1.5, ease, delay: delay + i * 0.055 }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}

function FadeUp({ children, delay, play, className }: { children: React.ReactNode; delay: number; play: boolean; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
      animate={play ? { opacity: 1, y: 0, filter: 'blur(0px)' } : undefined}
      transition={{ duration: 1.4, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

export function Hero() {
  const { ready } = useLoader();
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '24%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '-28%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const veil = useTransform(scrollYProgress, [0, 1], [0, 0.55]);

  // Art direction: a wide editorial frame on desktop, a vertical portrait on phones.
  const common = {
    alt: 'Arjun and Meera embracing by the river at sunset',
    fill: true,
    priority: true,
    quality: 80,
    sizes: '100vw',
  };
  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({ ...common, src: img.heroDesktop });
  const {
    props: { srcSet: mobileSrcSet, ...imgProps },
  } = getImageProps({ ...common, src: img.heroMobile });

  return (
    <section
      ref={ref}
      id="top"
      className="relative h-[100svh] min-h-[620px] w-full overflow-hidden bg-charcoal text-ivory"
    >
      <motion.div className="absolute inset-0 will-change-transform" style={{ y: imageY }}>
        <motion.div
          className="absolute inset-0"
          initial={{ clipPath: 'inset(14% 20% 14% 20%)' }}
          animate={ready ? { clipPath: 'inset(0% 0% 0% 0%)' } : undefined}
          transition={{ duration: 1.9, ease: easeInOut, delay: 0.1 }}
        >
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.35 }}
            animate={ready ? { scale: 1 } : undefined}
            transition={{ duration: 3.6, ease }}
          >
            <picture>
              <source media="(min-width: 768px)" srcSet={desktopSrcSet} sizes="100vw" />
              <source srcSet={mobileSrcSet} sizes="100vw" />
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <img {...imgProps} className="object-cover object-[50%_30%] md:object-[50%_40%]" />
            </picture>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Cinematic grading: soft vignette top, deep fall-off at the base for type. */}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-charcoal/45 via-charcoal/0 to-charcoal/80" />
      <div aria-hidden className="absolute inset-0 hidden bg-gradient-to-r from-charcoal/55 via-charcoal/5 to-transparent md:block" />
      <motion.div aria-hidden className="absolute inset-0 bg-charcoal" style={{ opacity: veil }} />

      <motion.div
        className="gutter relative flex h-full flex-col pb-8 pt-24 md:pb-12 md:pt-32 lg:pt-36"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        {/* Top line */}
        <div className="flex items-start justify-between">
          <FadeUp play={ready} delay={0.9} className="flex w-full flex-col items-center gap-3 md:w-auto md:flex-row md:gap-5">
            <span aria-hidden className="hidden h-px w-12 bg-ivory/60 md:block" />
            <p className="label text-ivory/90">We are getting married</p>
            <p className="label text-ivory/70 md:hidden">{couple.dateShort}</p>
          </FadeUp>
          <FadeUp play={ready} delay={1.1} className="hidden text-right md:block">
            <p className="label text-ivory/70">
              {couple.venue}
              <br />
              <span className="text-ivory/50">{couple.city}, India</span>
            </p>
          </FadeUp>
        </div>

        {/* Names + date */}
        <div className="mt-auto grid items-end gap-8 md:grid-cols-12">
          <h1 className="display text-center text-[clamp(4.25rem,21vw,7rem)] md:col-span-9 md:text-left md:text-[clamp(6rem,13.5vw,14rem)]">
            <span className="sr-only">
              {couple.groom} &amp; {couple.bride}
            </span>
            <span aria-hidden className="block">
              <Word text={couple.groom} play={ready} delay={0.5} />
            </span>
            <span aria-hidden className="block md:pl-[0.9em]">
              <Word text="&" play={ready} delay={0.75} className="mr-[0.18em] font-normal italic text-champagne" />
              <Word text={couple.bride} play={ready} delay={0.85} />
            </span>
          </h1>

          <div className="flex flex-col items-center gap-6 md:col-span-3 md:items-end md:pb-[1.4vw]">
            <FadeUp play={ready} delay={1.4} className="hidden md:block">
              <p className="nums font-serif text-3xl font-light tracking-[0.12em] lg:text-4xl">{couple.dateShort}</p>
            </FadeUp>
            <FadeUp play={ready} delay={1.6}>
              <button
                type="button"
                onClick={() => scrollToTarget('#couple')}
                className="group flex min-h-[44px] items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-ivory/90"
              >
                <span className="relative">
                  Explore our story
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-ivory/70 transition-transform duration-700 ease-lux group-hover:scale-x-100" />
                </span>
                <ArrowDown strokeWidth={1.25} className="h-4 w-4 animate-drift" />
              </button>
            </FadeUp>
          </div>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        aria-hidden
        className="absolute bottom-0 left-1/2 hidden h-16 w-px -translate-x-1/2 overflow-hidden bg-ivory/15 md:block"
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : undefined}
        transition={{ duration: 1, delay: 2 }}
      >
        <span className="block h-full w-full animate-scroll-line bg-ivory/80" />
      </motion.div>
    </section>
  );
}
