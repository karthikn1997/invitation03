'use client';

import Lenis from 'lenis';
import { MotionConfig } from 'framer-motion';
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { setLenis } from '@/lib/scroll';
import { InvitationIntro } from '@/components/ui/InvitationIntro';
import { Cursor } from '@/components/ui/Cursor';

const LoaderContext = createContext({ ready: false });

/** `ready` flips when the invitation curtain starts lifting — the hero choreographs off it. */
export const useLoader = () => useContext(LoaderContext);

export function Providers({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ duration: 1.35, smoothWheel: true, wheelMultiplier: 0.9 });
    setLenis(lenis);
    let raf = requestAnimationFrame(function loop(time) {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    });
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  const onReveal = useCallback(() => setReady(true), []);

  return (
    <MotionConfig reducedMotion="user">
      <LoaderContext.Provider value={{ ready }}>
        <InvitationIntro onReveal={onReveal} />
        {children}
        <Cursor />
        <div aria-hidden className="grain" />
      </LoaderContext.Provider>
    </MotionConfig>
  );
}
