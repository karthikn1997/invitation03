'use client';

import Image from 'next/image';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Play, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { Magnetic } from '@/components/motion/Magnetic';
import { Overlay } from '@/components/ui/Overlay';
import { img } from '@/lib/images';
import { ease } from '@/lib/motion';

/** Drop the edited highlight film here (e.g. public/video/highlight.mp4). */
const FILM_SRC = '/video/highlight.mp4';

export function Video() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [missing, setMissing] = useState(false);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-12%', '12%']);
  // Letterbox bars open as the section arrives — a quiet nod to the cinema.
  const bars = useTransform(scrollYProgress, [0.05, 0.4], reduce ? ['0%', '0%'] : ['12%', '0%']);

  return (
    <section
      ref={ref}
      id="film"
      aria-label="Our moments — wedding film"
      className="relative h-[90svh] min-h-[560px] overflow-hidden bg-charcoal text-ivory md:h-[100svh]"
    >
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, filter: 'blur(14px)' }}
        whileInView={{ opacity: 1, filter: 'blur(0px)' }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 2.2, ease }}
      >
        <motion.div className="absolute inset-x-0 -bottom-[14%] -top-[14%]" style={{ y }}>
          <div className="absolute inset-0 animate-kenburns">
            <Image
              src={img.videoPoster}
              alt=""
              fill
              sizes="100vw"
              placeholder="blur"
              className="object-cover object-[50%_40%]"
            />
          </div>
        </motion.div>
      </motion.div>

      <div aria-hidden className="absolute inset-0 bg-charcoal/50" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-charcoal/40" />
      <motion.div aria-hidden className="absolute inset-x-0 top-0 bg-charcoal" style={{ height: bars }} />
      <motion.div aria-hidden className="absolute inset-x-0 bottom-0 bg-charcoal" style={{ height: bars }} />

      <div className="gutter relative flex h-full flex-col items-center justify-center text-center">
        <motion.p
          className="label text-ivory/80"
          initial={{ opacity: 0, letterSpacing: '0.8em' }}
          whileInView={{ opacity: 1, letterSpacing: '0.3em' }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 2, ease }}
        >
          (04) — Our Moments
        </motion.p>

        <motion.div
          className="my-10 md:my-14"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.4, ease, delay: 0.2 }}
        >
          <Magnetic strength={0.35}>
            <button
              type="button"
              onClick={() => setOpen(true)}
              data-cursor="Play"
              aria-label="Play our wedding film"
              className="group relative flex h-24 w-24 items-center justify-center rounded-full border border-ivory/50 backdrop-blur-[2px] transition-colors duration-700 ease-lux hover:bg-ivory hover:text-charcoal md:h-32 md:w-32"
            >
              <span
                aria-hidden
                className="absolute inset-0 rounded-full border border-ivory/30 transition-transform duration-1000 ease-lux group-hover:scale-125 group-hover:opacity-0"
              />
              <Play strokeWidth={1} className="ml-1 h-6 w-6 fill-current md:h-7 md:w-7" />
            </button>
          </Magnetic>
        </motion.div>

        <motion.h2
          className="display text-[clamp(3rem,13vw,5rem)] italic md:text-[clamp(4.5rem,8vw,8.5rem)]"
          initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.6, ease, delay: 0.35 }}
        >
          Watch our story
        </motion.h2>
        <p className="label mt-8 text-ivory/50">Film · 3 min</p>
      </div>

      <Overlay open={open} onClose={() => setOpen(false)} label="Wedding film" className="bg-charcoal text-ivory">
        <div className="flex h-full flex-col">
          <div className="gutter flex justify-end py-5 md:py-7">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex min-h-[44px] items-center gap-3 text-[11px] uppercase tracking-[0.28em]"
            >
              Close <X strokeWidth={1} className="h-5 w-5" />
            </button>
          </div>
          <div className="gutter flex flex-1 items-center justify-center pb-12">
            <motion.div
              className="relative aspect-video w-full max-w-6xl overflow-hidden rounded-2xl bg-ink"
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease, delay: 0.1 }}
            >
              {missing ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center">
                  <p className="display text-4xl italic md:text-6xl">Coming soon</p>
                  <p className="max-w-sm text-[15px] leading-relaxed text-ivory/60">
                    Our highlight film is still in the edit. Check back closer to the day.
                  </p>
                </div>
              ) : (
                <video
                  src={FILM_SRC}
                  poster={img.videoPoster.src}
                  controls
                  autoPlay
                  playsInline
                  onError={() => setMissing(true)}
                  className="h-full w-full object-cover"
                />
              )}
            </motion.div>
          </div>
        </div>
      </Overlay>
    </section>
  );
}
