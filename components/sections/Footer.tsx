'use client';

import { ArrowUp, Mail, Phone } from 'lucide-react';
import { Reveal } from '@/components/motion/Reveal';
import { couple } from '@/lib/content';
import { scrollToTarget } from '@/lib/scroll';

function InstagramIcon({ className, strokeWidth = 1.1 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} className={className} aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

const social = [
  { label: 'Instagram', href: couple.instagram, icon: InstagramIcon, external: true },
  { label: 'Email', href: `mailto:${couple.email}`, icon: Mail },
  { label: 'Phone', href: `tel:${couple.phone.replace(/\s/g, '')}`, icon: Phone },
];

export function Footer() {
  return (
    <footer className="gutter relative bg-charcoal pb-10 pt-24 text-ivory md:pt-32">
      <div className="flex flex-col gap-14 md:flex-row md:items-end md:justify-between">
        <Reveal>
          <p className="font-serif text-2xl font-light italic text-ivory/60 md:text-3xl">With love,</p>
          <p className="display mt-3 text-[clamp(3.5rem,15vw,5.5rem)] md:text-[clamp(5rem,8vw,8.5rem)]">
            Arjun <span className="italic text-champagne">&amp;</span> Meera
          </p>
          <p className="nums label mt-6 text-ivory/50">{couple.dateShort}</p>
        </Reveal>

        <Reveal delay={0.15} className="flex items-center gap-3">
          {social.map(({ label, href, icon: Icon, external }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-ivory/20 transition-all duration-500 ease-lux hover:-translate-y-1 hover:border-ivory hover:bg-ivory hover:text-charcoal"
            >
              <Icon strokeWidth={1.1} className="h-[18px] w-[18px]" />
            </a>
          ))}
        </Reveal>
      </div>

      <div className="mt-20 flex flex-col-reverse gap-6 border-t border-ivory/10 pt-8 text-[11px] uppercase tracking-[0.28em] text-ivory/40 sm:flex-row sm:items-center sm:justify-between">
        <p>
          {couple.venue} · {couple.city}
        </p>
        <button
          type="button"
          onClick={() => scrollToTarget(0)}
          className="group flex min-h-[44px] items-center gap-3 self-start transition-colors duration-500 hover:text-ivory sm:self-auto"
        >
          Back to top
          <ArrowUp strokeWidth={1.25} className="h-4 w-4 transition-transform duration-500 ease-lux group-hover:-translate-y-1" />
        </button>
      </div>
    </footer>
  );
}
