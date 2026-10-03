'use client';

import { AnimatePresence, motion, useAnimate, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { couple } from '@/lib/content';
import { ease, easeInOut } from '@/lib/motion';
import { lockScroll } from '@/lib/scroll';

type Stage = 'enter' | 'ready' | 'opening';

const easeIn = [0.55, 0, 1, 0.45] as const;
const easeOut = [0, 0.55, 0.45, 1] as const;

/**
 * Opening sequence: a sealed envelope waits on an ivory stage. On "Open", the
 * monogram seal lifts, the flap swings back in 3D, the card rises out of the
 * pocket, and the whole stage lifts away like a curtain to reveal the hero.
 */
export function InvitationIntro({ onReveal }: { onReveal: () => void }) {
  const [visible, setVisible] = useState(true);
  const [stage, setStage] = useState<Stage>('enter');
  const [scope, animate] = useAnimate();
  const reduce = useReducedMotion();
  const locked = useRef(false);
  const revealRef = useRef(onReveal);
  revealRef.current = onReveal;

  // Hold the page still while the invitation is on screen.
  useEffect(() => {
    locked.current = true;
    lockScroll(true);
    const t = window.setTimeout(() => setStage('ready'), 1800);
    return () => {
      clearTimeout(t);
      if (locked.current) {
        locked.current = false;
        lockScroll(false);
      }
    };
  }, []);

  const finish = useCallback(() => {
    if (locked.current) {
      locked.current = false;
      lockScroll(false);
    }
    setVisible(false);
    revealRef.current();
  }, []);

  const open = useCallback(async () => {
    if (stage !== 'ready') return;
    setStage('opening');
    const d = (s: number) => (reduce ? 0 : s);

    await animate('[data-seal]', { scale: 0.5, opacity: 0, rotate: -24 }, { duration: d(0.7), ease });
    await animate('[data-flap]', { rotateX: 90 }, { duration: d(0.55), ease: easeIn });
    // Past vertical, the flap tucks behind the card.
    await animate('[data-flap]', { zIndex: 1 }, { duration: 0 });
    await animate('[data-flap]', { rotateX: 180 }, { duration: d(0.65), ease: easeOut });
    await animate('[data-card]', { y: '-60%' }, { duration: d(1.5), ease });
    await new Promise((r) => setTimeout(r, reduce ? 0 : 700));
    finish();
  }, [animate, finish, reduce, stage]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="invitation"
          ref={scope}
          role="dialog"
          aria-modal="true"
          aria-label="Wedding invitation"
          className="fixed inset-0 z-[100] overflow-hidden bg-[radial-gradient(ellipse_at_50%_45%,#FBF8F3_0%,#F3EDE3_55%,#EAE2D5_100%)] text-charcoal"
          initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          transition={{ duration: 1.4, ease: easeInOut }}
        >
          {/* Editorial frame */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-3 border border-charcoal/10 md:inset-6"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, ease }}
          />

          <motion.div
            className="absolute inset-x-6 top-6 flex items-center justify-between md:inset-x-12 md:top-11"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, delay: 0.6 }}
          >
            <span className="font-serif text-xl font-light">
              A<span className="mx-0.5 italic text-champagne">&amp;</span>M
            </span>
            <button
              type="button"
              onClick={finish}
              className="min-h-[44px] text-[10px] uppercase tracking-[0.3em] text-charcoal/50 transition-colors duration-500 hover:text-charcoal"
            >
              Skip
            </button>
          </motion.div>

          <motion.div
            className="label absolute inset-x-6 bottom-6 flex items-center justify-between text-charcoal/50 md:inset-x-12 md:bottom-11"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, delay: 0.8 }}
          >
            <span className="nums">{couple.dateShort}</span>
            <span>{couple.city} — India</span>
          </motion.div>

          {/* Stage */}
          <div className="flex h-full flex-col items-center justify-center px-6">
            <motion.p
              className="label mb-[clamp(4.5rem,13vh,8rem)] text-taupe"
              initial={{ opacity: 0, y: 12, letterSpacing: '0.6em' }}
              animate={
                stage === 'opening'
                  ? { opacity: 0, y: -12, letterSpacing: '0.3em' }
                  : { opacity: 1, y: 0, letterSpacing: '0.3em' }
              }
              transition={{ duration: stage === 'opening' ? 0.6 : 1.8, ease, delay: stage === 'opening' ? 0 : 0.4 }}
            >
              You are cordially invited
            </motion.p>

            {/* Envelope */}
            <motion.div
              initial={{ opacity: 0, y: 70, rotateX: 18 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 1.8, ease, delay: 0.2 }}
              className="[perspective:1400px]"
            >
              <button
                type="button"
                onClick={open}
                disabled={stage !== 'ready'}
                aria-label="Open the invitation"
                data-cursor={stage === 'ready' ? 'Open' : undefined}
                className="group relative block aspect-[3/2] w-[min(86vw,540px)] text-left disabled:cursor-default [perspective:1400px]"
              >
                {/* Back of the envelope */}
                <span className="absolute inset-0 rounded-[4px] bg-[#E6DDCF] shadow-[0_50px_90px_-40px_rgba(27,25,22,0.45),0_2px_6px_rgba(27,25,22,0.06)]" />

                {/* The card */}
                <span
                  data-card
                  className="absolute bottom-[5%] left-[5%] right-[5%] top-[5%] z-[2] flex flex-col items-center bg-ivory px-4 pt-[6%] text-center shadow-[0_1px_3px_rgba(27,25,22,0.08)]"
                >
                  <span aria-hidden className="absolute inset-[6px] border border-charcoal/10 md:inset-[9px]" />
                  <span className="label text-[8px] text-taupe md:text-[10px]">Together with their families</span>
                  <span className="mt-[4%] font-serif text-[clamp(1.9rem,8.5vw,3.25rem)] font-light leading-none">
                    Arjun <span className="italic text-champagne">&amp;</span> Meera
                  </span>
                  <span className="mt-[3%] font-serif text-[clamp(0.85rem,3vw,1.1rem)] italic text-ink/70">
                    request the pleasure of your company
                  </span>
                  <span className="nums label mt-[4%] text-[9px] text-charcoal/70 md:text-[11px]">
                    {couple.dateShort}
                  </span>
                </span>

                {/* Front pocket */}
                <svg
                  aria-hidden
                  viewBox="0 0 300 200"
                  preserveAspectRatio="none"
                  className="absolute inset-0 z-[3] h-full w-full overflow-visible"
                >
                  <path d="M0 0 L150 112 L300 0 L300 200 L0 200 Z" fill="#EFE7DA" />
                  <path d="M0 200 L150 104 L300 200 Z" fill="#ECE3D5" />
                  <path
                    d="M0 0 L150 112 L300 0 M0 200 L150 104 L300 200"
                    fill="none"
                    stroke="rgba(27,25,22,0.08)"
                    strokeWidth="0.6"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
                <span className="absolute inset-x-0 bottom-[9%] z-[3] text-center font-serif text-[clamp(0.8rem,2.6vw,1rem)] italic text-taupe">
                  For our dearest family &amp; friends
                </span>

                {/* Flap — two faces so the inside shows once it swings open */}
                <span
                  data-flap
                  className="absolute inset-x-0 top-0 z-[4] block h-[58%] origin-top [transform-style:preserve-3d]"
                  style={{ filter: 'drop-shadow(0 8px 10px rgba(27,25,22,0.08))' }}
                >
                  <span className="absolute inset-0 bg-[linear-gradient(180deg,#E9E0D2_0%,#E1D6C5_100%)] [backface-visibility:hidden] [clip-path:polygon(0_0,100%_0,50%_100%)]" />
                  <span className="absolute inset-0 bg-[linear-gradient(0deg,#F3ECE1_0%,#E8DFD1_100%)] [backface-visibility:hidden] [clip-path:polygon(0_0,100%_0,50%_100%)] [transform:rotateX(180deg)]" />
                </span>

                {/* Monogram seal */}
                <span
                  data-seal
                  className="absolute left-1/2 top-[58%] z-[5] -ml-8 -mt-8 flex h-16 w-16 items-center justify-center rounded-full bg-charcoal text-ivory shadow-[0_8px_20px_-6px_rgba(27,25,22,0.5)] md:-ml-10 md:-mt-10 md:h-20 md:w-20"
                >
                  {stage === 'ready' && (
                    <span aria-hidden className="absolute inset-0 animate-seal rounded-full border border-charcoal/40" />
                  )}
                  <span aria-hidden className="absolute inset-[5px] rounded-full border border-champagne/40" />
                  <span className="font-serif text-lg font-light md:text-xl">
                    A<span className="italic text-champagne">&amp;</span>M
                  </span>
                </span>
              </button>
            </motion.div>

            <div className="mt-[clamp(3rem,9vh,5.5rem)] flex h-[100px] flex-col items-center">
              <AnimatePresence>
                {stage === 'ready' && (
                  <motion.div
                    className="flex flex-col items-center gap-5"
                    initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
                    transition={{ duration: 1, ease }}
                  >
                    <p className="font-serif text-lg font-light italic text-ink/70">
                      A celebration of love awaits
                    </p>
                    <ArrowLink onClick={open}>Open invitation</ArrowLink>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
