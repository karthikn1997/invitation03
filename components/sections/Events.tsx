'use client';

import clsx from 'clsx';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useRef, type PointerEvent } from 'react';
import { MaskImage } from '@/components/motion/MaskImage';
import { Reveal } from '@/components/motion/Reveal';
import { SplitLines } from '@/components/motion/SplitLines';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { couple, eventDetails, events } from '@/lib/content';
import { img } from '@/lib/images';
import { ease } from '@/lib/motion';

type Event = (typeof events)[number];

/* ───────────────────────── Timeline marker ───────────────────────── */

/** Lights up once the drawn rail reaches its position. */
function Node({ progress, at }: { progress: MotionValue<number>; at: number }) {
  const fill = useTransform(progress, (p) => (p >= at ? 1 : 0));
  return (
    <span
      className="absolute top-1/2 flex h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-champagne/50 bg-charcoal"
      style={{ left: `${at * 100}%` }}
    >
      <motion.span
        className="h-1.5 w-1.5 rounded-full bg-champagne"
        style={{ scale: fill, opacity: fill }}
        transition={{ duration: 0.4 }}
      />
    </span>
  );
}

/* ───────────────────────── Event card ───────────────────────── */

function EventCard({ event, index }: { event: Event; index: number }) {
  // A soft spotlight follows the pointer via CSS variables (no re-renders).
  const onMove = (e: PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`);
  };

  return (
    <motion.article
      onPointerMove={onMove}
      className="group relative flex min-h-[400px] flex-col overflow-hidden border border-ivory/10 bg-ivory/[0.025] p-8 md:min-h-[460px] md:p-10"
      initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 1.4, ease, delay: index * 0.15 }}
    >
      {/* Spotlight */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(420px circle at var(--x, 50%) var(--y, 50%), rgba(201,182,151,0.14), transparent 60%)',
        }}
      />
      {/* Champagne frame that draws itself on hover */}
      <span aria-hidden className="absolute left-0 top-0 h-px w-full origin-left scale-x-0 bg-champagne/70 transition-transform duration-700 ease-lux group-hover:scale-x-100" />
      <span aria-hidden className="absolute right-0 top-0 h-full w-px origin-top scale-y-0 bg-champagne/70 transition-transform delay-150 duration-700 ease-lux group-hover:scale-y-100" />
      <span aria-hidden className="absolute bottom-0 right-0 h-px w-full origin-right scale-x-0 bg-champagne/70 transition-transform delay-300 duration-700 ease-lux group-hover:scale-x-100" />
      <span aria-hidden className="absolute bottom-0 left-0 h-full w-px origin-bottom scale-y-0 bg-champagne/70 transition-transform delay-[450ms] duration-700 ease-lux group-hover:scale-y-100" />

      <div className="relative flex items-center justify-between">
        <span className="font-serif text-2xl italic text-champagne">{event.index}</span>
        <span className="label text-ivory/40">Part {['one', 'two', 'three'][index]}</span>
      </div>

      <p className="relative mt-10 flex items-start gap-2 md:mt-14">
        <span className="nums font-serif text-[4.5rem] font-light leading-none transition-transform duration-1000 ease-lux group-hover:-translate-y-1 md:text-[5.5rem]">
          {event.time}
        </span>
        <span className="label mt-3 text-champagne">{event.period}</span>
      </p>

      <div className="relative mt-auto pt-12">
        <h3 className="font-serif text-[2rem] font-light leading-tight md:text-[2.3rem]">{event.name}</h3>
        <p className="label mt-3 text-ivory/45">{event.place}</p>
        <span aria-hidden className="mt-6 block h-px w-12 bg-champagne/50 transition-all duration-1000 ease-lux group-hover:w-full" />
        <p className="mt-6 text-[14px] leading-relaxed text-ivory/60">{event.note}</p>
      </div>
    </motion.article>
  );
}

/* ───────────────────────── Section ───────────────────────── */

export function Events() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const dayY = useTransform(scrollYProgress, [0, 0.5], reduce ? ['0%', '0%'] : ['18%', '-6%']);
  const monthX = useTransform(scrollYProgress, [0, 0.5], reduce ? ['0%', '0%'] : ['8%', '0%']);
  const glowY = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-20%', '30%']);

  const { scrollYProgress: rail } = useScroll({ target: timelineRef, offset: ['start 0.9', 'start 0.4'] });

  return (
    <section ref={sectionRef} id="details" className="relative overflow-hidden bg-charcoal py-28 text-ivory md:py-40 lg:py-48">
      {/* Ambient champagne glow, drifting with the scroll */}
      <motion.div
        aria-hidden
        style={{ y: glowY }}
        className="pointer-events-none absolute -left-[20%] -top-[10%] h-[70vh] w-[70vw] rounded-full bg-[radial-gradient(closest-side,rgba(201,182,151,0.12),transparent)]"
      />

      {/* Header */}
      <div className="gutter relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <Reveal>
          <SectionLabel index="02" className="text-champagne">
            The Wedding
          </SectionLabel>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="label text-ivory/50">Sunday · The twenty-fourth of January</p>
        </Reveal>
      </div>

      {/* Date composition */}
      <div className="gutter relative mt-14 md:mt-20">
        <div className="flex flex-col gap-4 border-b border-ivory/10 pb-14 md:flex-row md:items-end md:gap-12 md:pb-20">
          <motion.div style={{ y: dayY }}>
            <SplitLines
              as="p"
              className="display nums text-[clamp(9rem,46vw,12rem)] leading-[0.78] md:text-[clamp(12rem,24vw,24rem)]"
              lines={['24']}
              duration={1.6}
            />
          </motion.div>

          <motion.div style={{ x: monthX }} className="md:pb-[2.4vw]">
            <SplitLines
              as="h2"
              className="display text-[clamp(3rem,13vw,4.5rem)] italic md:text-[clamp(3.5rem,6vw,6.5rem)]"
              lines={['January', <span key="y" className="not-italic text-champagne">2027</span>]}
              delay={0.15}
            />
          </motion.div>

          <Reveal delay={0.35} className="md:ml-auto md:pb-[2.6vw]">
            <div className="flex items-center gap-6 md:flex-col md:items-end md:gap-3">
              <span aria-hidden className="h-px w-12 bg-champagne/60 md:hidden" />
              <p className="label text-ivory/45">Ceremony begins</p>
              <p className="nums font-serif text-4xl font-light md:text-5xl">
                6:30 <span className="text-2xl italic text-champagne">pm</span>
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      {/* The evening */}
      <div className="gutter relative mt-16 md:mt-24">
        <div className="flex items-end justify-between">
          <SplitLines
            as="h3"
            className="display text-[clamp(2.5rem,10vw,3.5rem)] md:text-[clamp(3rem,4.5vw,4.5rem)]"
            lines={[<>The <span className="italic">evening</span></>]}
          />
          <Reveal delay={0.2} className="hidden max-w-[16rem] text-right md:block">
            <p className="text-[14px] leading-relaxed text-ivory/50">
              Three moments, one unforgettable night. All held at {couple.venue}.
            </p>
          </Reveal>
        </div>

        {/* Rail that draws across and lights each part of the night */}
        <div ref={timelineRef} aria-hidden className="relative mt-12 hidden h-6 md:block">
          <span className="absolute left-0 right-0 top-1/2 h-px bg-ivory/10" />
          <motion.span
            className="absolute left-0 right-0 top-1/2 h-px origin-left bg-champagne/70"
            style={{ scaleX: rail }}
          />
          {[1 / 6, 1 / 2, 5 / 6].map((at) => (
            <Node key={at} progress={rail} at={at} />
          ))}
        </div>

        <div className="mt-10 grid gap-5 md:mt-8 md:grid-cols-3 md:gap-6">
          {events.map((e, i) => (
            <EventCard key={e.name} event={e} index={i} />
          ))}
        </div>
      </div>

      {/* Venue banner */}
      <div className="gutter relative mt-20 md:mt-28">
        <div className="relative isolate overflow-hidden rounded-[24px] md:rounded-[28px]">
          <div className="absolute inset-0">
            <MaskImage
              src={img.events}
              alt="An elegant table set with glassware and candlelight"
              sizes="100vw"
              className="h-full w-full"
              parallax={14}
              direction="center"
              hoverZoom={false}
            />
          </div>
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/70 to-charcoal/30 md:bg-gradient-to-r md:from-charcoal/95 md:via-charcoal/60 md:to-charcoal/10" />

          <div className="relative grid min-h-[620px] gap-12 p-7 xs:p-9 md:min-h-[520px] md:grid-cols-12 md:items-end md:p-14 lg:p-16">
            <div className="flex flex-col justify-end md:col-span-7">
              <Reveal>
                <p className="label text-champagne">The Venue</p>
              </Reveal>
              <SplitLines
                as="h3"
                className="display mt-6 text-[clamp(3rem,13vw,4.5rem)] md:text-[clamp(4rem,6.5vw,7rem)]"
                lines={[couple.venue, <span key="c" className="italic text-champagne">{couple.city}</span>]}
                delay={0.1}
              />
              <Reveal delay={0.3} className="mt-10">
                <ArrowLink href={couple.mapsUrl} external tone="light">
                  View location
                </ArrowLink>
              </Reveal>
            </div>

            <dl className="self-end border-t border-ivory/15 md:col-span-4 md:col-start-9">
              {eventDetails.map(([term, detail], i) => (
                <motion.div
                  key={term}
                  className={clsx('flex items-baseline justify-between gap-6 border-b border-ivory/15 py-4')}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ duration: 1.1, ease, delay: 0.2 + i * 0.12 }}
                >
                  <dt className="label text-ivory/45">{term}</dt>
                  <dd className="text-right font-serif text-lg italic text-ivory/90">{detail}</dd>
                </motion.div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
