'use client';

import clsx from 'clsx';
import { ArrowRight } from 'lucide-react';
import type { MouseEventHandler, ReactNode } from 'react';
import { Magnetic } from '@/components/motion/Magnetic';

type ArrowLinkProps = {
  children: ReactNode;
  href?: string;
  onClick?: MouseEventHandler;
  external?: boolean;
  tone?: 'dark' | 'light';
  variant?: 'pill' | 'text';
  icon?: ReactNode;
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
};

/**
 * Minimal call to action. `pill` fills from the bottom on hover; `text` draws an
 * underline. The arrow slides out and a twin slides in for a quiet micro-motion.
 */
export function ArrowLink({
  children,
  href,
  onClick,
  external,
  tone = 'dark',
  variant = 'pill',
  icon,
  className,
  type = 'button',
  disabled,
}: ArrowLinkProps) {
  const dark = tone === 'dark';
  const arrow = icon ?? <ArrowRight strokeWidth={1.25} className="h-4 w-4" />;

  const inner = (
    <>
      {variant === 'pill' && (
        <span
          aria-hidden
          className={clsx(
            'absolute inset-0 origin-bottom scale-y-0 rounded-full transition-transform duration-700 ease-lux group-hover/cta:scale-y-100',
            dark ? 'bg-charcoal' : 'bg-ivory',
          )}
        />
      )}
      <span className="relative">{children}</span>
      <span aria-hidden className="relative inline-flex h-4 w-4 overflow-hidden">
        <span className="absolute inset-0 transition-transform duration-500 ease-lux group-hover/cta:translate-x-full">
          {arrow}
        </span>
        <span className="absolute inset-0 -translate-x-full transition-transform duration-500 ease-lux group-hover/cta:translate-x-0">
          {arrow}
        </span>
      </span>
      {variant === 'text' && (
        <>
          <span
            aria-hidden
            className={clsx(
              'absolute bottom-2 left-0 h-px w-full origin-right transition-transform duration-500 ease-lux group-hover/cta:scale-x-0',
              dark ? 'bg-charcoal/40' : 'bg-ivory/50',
            )}
          />
          <span
            aria-hidden
            className={clsx(
              'absolute bottom-2 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-700 ease-lux group-hover/cta:scale-x-100 group-hover/cta:delay-200',
              dark ? 'bg-charcoal' : 'bg-ivory',
            )}
          />
        </>
      )}
    </>
  );

  const classes = clsx(
    'group/cta relative inline-flex items-center gap-3 overflow-hidden text-[11px] font-medium uppercase tracking-[0.28em] transition-colors duration-700 ease-lux',
    variant === 'pill' && 'min-h-[52px] rounded-full border px-8',
    variant === 'pill' &&
      (dark
        ? 'border-charcoal/30 text-charcoal hover:text-ivory'
        : 'border-ivory/40 text-ivory hover:text-charcoal'),
    variant === 'text' && 'min-h-[44px]',
    variant === 'text' && (dark ? 'text-charcoal' : 'text-ivory'),
    disabled && 'pointer-events-none opacity-50',
    className,
  );

  const el = href ? (
    <a
      href={href}
      onClick={onClick}
      className={classes}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {inner}
    </a>
  ) : (
    <button type={type} onClick={onClick} className={classes} disabled={disabled}>
      {inner}
    </button>
  );

  return <Magnetic strength={0.18}>{el}</Magnetic>;
}
