'use client';

import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';
import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { lockScroll } from '@/lib/scroll';

type OverlayProps = {
  open: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
  className?: string;
  onKey?: (e: KeyboardEvent) => void;
};

/** Accessible fullscreen layer: portal, scroll lock, Escape to close, focus restore. */
export function Overlay({ open, onClose, label, children, className, onKey }: OverlayProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const keyRef = useRef(onKey);
  keyRef.current = onKey;
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    lockScroll(true);
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeRef.current();
      keyRef.current?.(e);
    };
    window.addEventListener('keydown', handle);
    const focusTimer = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>('button, a, [tabindex="0"]')?.focus();
    }, 50);
    return () => {
      clearTimeout(focusTimer);
      window.removeEventListener('keydown', handle);
      lockScroll(false);
      previous?.focus?.();
    };
  }, [open]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={label}
          data-lenis-prevent
          className={clsx('fixed inset-0 z-[90]', className)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
