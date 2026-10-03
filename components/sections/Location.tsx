'use client';

import clsx from 'clsx';
import { motion } from 'framer-motion';
import { BedDouble, Car, Check, Copy, Plane } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Reveal } from '@/components/motion/Reveal';
import { SplitLines } from '@/components/motion/SplitLines';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { couple } from '@/lib/content';
import { ease, easeInOut } from '@/lib/motion';

const address = `${couple.venue}, ${couple.city}, Tamil Nadu, India`;
const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${couple.venue} ${couple.city}`)}`;

const travel = [
  { icon: Plane, title: 'From the airport', detail: 'About 35 minutes by car from Chennai International (MAA).' },
  { icon: Car, title: 'Parking', detail: 'Complimentary valet at the main entrance throughout the evening.' },
  { icon: BedDouble, title: 'Stay', detail: 'A room block is held at the hotel under “Arjun & Meera”.' },
];

/** Live local time in Chennai — a small editorial detail for travelling guests. */
function LocalTime() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    const tick = () => setTime(fmt.format(new Date()).toUpperCase());
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, []);
  return <span className="nums">{time || '—'}</span>;
}

function CopyAddress() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      /* clipboard unavailable — the address stays visible for manual copy */
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="group flex min-h-[44px] items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-charcoal"
    >
      <span className="relative flex h-4 w-4 items-center justify-center">
        <motion.span className="absolute" animate={{ opacity: copied ? 0 : 1, scale: copied ? 0.6 : 1 }} transition={{ duration: 0.4 }}>
          <Copy strokeWidth={1.25} className="h-4 w-4" />
        </motion.span>
        <motion.span className="absolute" initial={false} animate={{ opacity: copied ? 1 : 0, scale: copied ? 1 : 0.6 }} transition={{ duration: 0.4 }}>
          <Check strokeWidth={1.5} className="h-4 w-4" />
        </motion.span>
      </span>
      <span className="relative">
        <span aria-live="polite">{copied ? 'Copied' : 'Copy address'}</span>
        <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-charcoal/60 transition-transform duration-700 ease-lux group-hover:scale-x-100" />
      </span>
    </button>
  );
}

function VenueCard({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        'rounded-[24px] border border-white/80 bg-ivory/80 p-6 shadow-[0_30px_70px_-40px_rgba(27,25,22,0.5)] backdrop-blur-xl xs:p-8',
        className,
      )}
    >
      <p className="label text-taupe">The venue</p>
      <p className="mt-4 font-serif text-3xl font-light leading-tight md:text-4xl">
        {couple.venue}
        <span className="block italic text-taupe">{couple.city}</span>
      </p>
      <p className="mt-4 text-[14px] leading-relaxed text-ink/70">{address}</p>
      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-charcoal/10 pt-6">
        <ArrowLink href={directionsUrl} external>
          Get directions
        </ArrowLink>
        <CopyAddress />
      </div>
    </div>
  );
}

export function Location() {
  return (
    <section id="location" className="relative overflow-hidden bg-ivory py-28 md:py-40 lg:py-48">
      <div className="gutter">
        {/* Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <Reveal>
            <SectionLabel index="06" className="text-taupe">
              The Venue
            </SectionLabel>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="label flex flex-wrap items-center gap-x-4 gap-y-2 text-taupe">
              <span>13.0827° N, 80.2707° E</span>
              <span aria-hidden className="h-px w-6 bg-taupe/40" />
              <span>
                Local time <LocalTime /> IST
              </span>
            </p>
          </Reveal>
        </div>

        <div className="mt-10 flex flex-col gap-8 md:mt-14 md:flex-row md:items-end md:justify-between">
          <SplitLines
            as="h2"
            className="display text-[clamp(3.25rem,13vw,5.5rem)] md:text-[clamp(5rem,9vw,10rem)]"
            lines={[couple.venue, <span key="c" className="italic text-taupe">{couple.city}</span>]}
            lineClassName={(i) => (i === 1 ? 'md:pl-[1.5em]' : undefined)}
          />
          <Reveal delay={0.25} className="max-w-xs md:pb-6">
            <p className="text-[15px] leading-relaxed text-ink/70">
              A landmark of quiet elegance in the heart of the city — where the evening will unfold, from vows to the
              last dance.
            </p>
          </Reveal>
        </div>

        {/* Map stage */}
        <div className="relative mt-14 md:mt-20">
          <motion.div
            className="group relative h-[62vh] min-h-[420px] overflow-hidden rounded-[28px] border border-charcoal/10 bg-sand shadow-[0_50px_100px_-60px_rgba(27,25,22,0.55)] md:h-[72vh] md:min-h-[560px] md:rounded-[36px]"
            initial={{ clipPath: 'inset(14% 14% 14% 14% round 36px)', opacity: 0, scale: 0.98 }}
            whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 36px)', opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 1.8, ease: easeInOut }}
          >
            <iframe
              title={`Map showing ${couple.venue}, ${couple.city}`}
              src={couple.mapsEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0 transition-[filter] duration-[1400ms] ease-lux [filter:grayscale(1)_sepia(0.2)_contrast(0.92)_brightness(1.03)] group-hover:[filter:grayscale(0.15)_sepia(0.1)_contrast(1)_brightness(1)]"
            />
            {/* Soft vignette so the floating card sits well */}
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ivory/40 via-transparent to-transparent" />

            <motion.div
              className="absolute bottom-8 left-8 hidden w-[380px] md:block lg:bottom-10 lg:left-10"
              initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1.3, ease, delay: 0.8 }}
            >
              <VenueCard />
            </motion.div>

            <span className="label pointer-events-none absolute right-6 top-6 hidden rounded-full border border-white/70 bg-white/70 px-4 py-2 text-charcoal backdrop-blur-md md:block">
              Hover to explore
            </span>
          </motion.div>

          {/* On phones the card sits beneath the map */}
          <Reveal className="relative z-10 -mt-12 px-3 md:hidden">
            <VenueCard />
          </Reveal>
        </div>

        {/* Getting there */}
        <div className="mt-20 md:mt-28">
          <SplitLines
            as="h3"
            className="display text-[clamp(2.5rem,10vw,3.5rem)] md:text-[clamp(3rem,4.5vw,4.5rem)]"
            lines={[<>Getting <span className="italic">there</span></>]}
          />
          <div className="mt-10 grid gap-5 md:mt-12 md:grid-cols-3 md:gap-6">
            {travel.map(({ icon: Icon, title, detail }, i) => (
              <motion.article
                key={title}
                className="group relative overflow-hidden rounded-[22px] border border-charcoal/10 bg-white/40 p-7 transition-[transform,border-color,box-shadow] duration-700 ease-lux hover:-translate-y-1.5 hover:border-champagne hover:shadow-[0_30px_60px_-40px_rgba(27,25,22,0.4)] md:p-9"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 1.2, ease, delay: i * 0.12 }}
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-charcoal/15 transition-colors duration-700 group-hover:border-charcoal group-hover:bg-charcoal group-hover:text-ivory">
                  <Icon strokeWidth={1} className="h-6 w-6" />
                </span>
                <h4 className="mt-8 font-serif text-[1.75rem] font-light leading-tight">{title}</h4>
                <p className="mt-3 text-[14px] leading-relaxed text-ink/65">{detail}</p>
                <span className="label nums absolute right-7 top-7 text-taupe/60 md:right-9 md:top-9">0{i + 1}</span>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
