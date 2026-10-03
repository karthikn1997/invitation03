'use client';

import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useState } from 'react';
import { useLoader } from '@/components/providers/Providers';
import { Overlay } from '@/components/ui/Overlay';
import { ease } from '@/lib/motion';
import { scrollToTarget } from '@/lib/scroll';
import { couple } from '@/lib/content';

const links = [
  { label: 'Couple', href: '#couple' },
  { label: 'Details', href: '#details' },
  { label: 'Venue', href: '#location' },
];

export function Nav() {
  const { ready } = useLoader();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, 'change', (v) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(v > prev && v > 240);
  });

  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    // Let the menu fade before travelling.
    window.setTimeout(() => scrollToTarget(href), open ? 450 : 0);
  };

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50 text-ivory mix-blend-difference"
        initial={{ opacity: 0, y: -24 }}
        animate={ready ? { opacity: 1, y: hidden ? '-110%' : '0%' } : undefined}
        transition={{ duration: 1, ease, delay: hidden ? 0 : 0.2 }}
      >
        <nav
          aria-label="Primary"
          className="flex items-center justify-between px-6 py-5 md:px-12 md:py-7 lg:px-20"
        >
          <a
            href="#top"
            onClick={go('#top')}
            aria-label="Arjun & Meera — back to top"
            className="font-serif text-2xl font-light tracking-wide"
          >
            A<span className="mx-0.5 italic">&amp;</span>M
          </a>

          <ul className="hidden items-center gap-10 lg:flex">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={go(l.href)} className="group relative py-2 text-[11px] uppercase tracking-[0.28em]">
                  {l.label}
                  <span className="absolute bottom-0 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-700 ease-lux group-hover:origin-left group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-6">
            <a
              href="#rsvp"
              onClick={go('#rsvp')}
              className="hidden min-h-[40px] items-center rounded-full border border-ivory/50 px-6 text-[11px] uppercase tracking-[0.28em] transition-colors duration-500 hover:bg-ivory hover:text-charcoal md:inline-flex"
            >
              RSVP
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              className="flex min-h-[44px] items-center gap-3 text-[11px] uppercase tracking-[0.28em] lg:hidden"
            >
              Menu
              <span aria-hidden className="flex w-6 flex-col gap-[5px]">
                <span className="h-px w-full bg-current" />
                <span className="h-px w-2/3 self-end bg-current" />
              </span>
            </button>
          </div>
        </nav>
      </motion.header>

      <Overlay open={open} onClose={() => setOpen(false)} label="Site menu" className="bg-charcoal text-ivory">
        <div className="flex h-full flex-col px-6 py-5 md:px-12 md:py-7">
          <div className="flex items-center justify-between">
            <span className="font-serif text-2xl font-light">
              A<span className="mx-0.5 italic">&amp;</span>M
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="min-h-[44px] text-[11px] uppercase tracking-[0.28em]"
            >
              Close
            </button>
          </div>

          <ul className="mt-auto space-y-2">
            {[...links, { label: 'RSVP', href: '#rsvp' }].map((l, i) => (
              <li key={l.href} className="overflow-hidden">
                <motion.a
                  href={l.href}
                  onClick={go(l.href)}
                  className="flex items-baseline gap-4 py-1 font-serif text-[13vw] font-light leading-[1.05] md:text-7xl"
                  initial={{ y: '110%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 1, ease, delay: 0.15 + i * 0.07 }}
                >
                  <span className="font-sans text-[10px] tracking-[0.2em] text-ivory/40">0{i + 1}</span>
                  {l.label}
                </motion.a>
              </li>
            ))}
          </ul>

            <motion.div
              className="mt-12 flex items-end justify-between border-t border-ivory/15 pt-6 text-[11px] uppercase tracking-[0.28em] text-ivory/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              <span>{couple.dateShort}</span>
              <span>
                {couple.venue}, {couple.city}
              </span>
            </motion.div>
        </div>
      </Overlay>
    </>
  );
}
