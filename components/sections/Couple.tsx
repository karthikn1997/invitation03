'use client';

import clsx from 'clsx';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { useRef, type PointerEvent, type ReactNode } from 'react';
import { MaskImage } from '@/components/motion/MaskImage';
import { Reveal } from '@/components/motion/Reveal';
import { SplitLines } from '@/components/motion/SplitLines';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { couple } from '@/lib/content';
import { img } from '@/lib/images';
import { ease } from '@/lib/motion';

const people = {
  bride: {
    role: 'The Bride',
    name: couple.bride,
    line: '“She finds poetry in blueprints.”',
    text: 'An architect who sketches on napkins and collects old jazz records. Meera believes in long walks, handwritten letters and that the best conversations happen after midnight.',
    facts: [
      ['Hometown', 'Chennai'],
      ['Profession', 'Architect'],
      ['Loves', 'Jazz & old letters'],
    ],
  },
  groom: {
    role: 'The Groom',
    name: couple.groom,
    line: '“He still insists he saw her first.”',
    text: 'A product designer with a weakness for strong coffee and stronger opinions on cinema. Arjun plans every trip to the minute — and abandons the plan the moment she smiles.',
    facts: [
      ['Hometown', 'Bengaluru'],
      ['Profession', 'Product designer'],
      ['Loves', 'Cinema & coffee'],
    ],
  },
};

/* ───────────────────────── Pieces ───────────────────────── */

/** Letters rise from behind a mask, blur-to-sharp, one after another. */
function CharReveal({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  return (
    <motion.span
      aria-label={text}
      className={clsx('inline-flex overflow-hidden pb-[0.1em] pr-[0.06em]', className)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.6 }}
    >
      {text.split('').map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="inline-block will-change-transform"
          variants={{
            hidden: { y: '105%', opacity: 0, filter: 'blur(10px)' },
            show: {
              y: '0%',
              opacity: 1,
              filter: 'blur(0px)',
              transition: { duration: 1.4, ease, delay: delay + i * 0.07 },
            },
          }}
        >
          {ch}
        </motion.span>
      ))}
    </motion.span>
  );
}

/** Portrait frame that leans toward the cursor with a soft travelling sheen. */
function TiltFrame({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const glare = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 110, damping: 18, mass: 0.6 });
  const sry = useSpring(ry, { stiffness: 110, damping: 18, mass: 0.6 });
  const sGlare = useSpring(glare, { stiffness: 90, damping: 20 });
  const sheen = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, rgba(255,248,236,0.55), transparent 55%)`;

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * 7);
    rx.set((0.5 - py) * 7);
    gx.set(px * 100);
    gy.set(py * 100);
    glare.set(1);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
    glare.set(0);
  };

  return (
    <motion.div
      className={clsx('relative', className)}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 1200 }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-soft-light"
        style={{ background: sheen, opacity: sGlare }}
      />
    </motion.div>
  );
}

/** Rotating ring of text around a champagne ampersand — turns with the scroll. */
function Monogram({ rotate }: { rotate: MotionValue<number> }) {
  return (
    <motion.div
      className="relative h-36 w-36 md:h-44 md:w-44"
      initial={{ opacity: 0, scale: 0.6 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 1.6, ease }}
    >
      <motion.svg aria-hidden viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" style={{ rotate }}>
        <defs>
          <path id="couple-ring" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text className="fill-taupe" style={{ fontSize: 12.5, letterSpacing: '0.3em', fontFamily: 'var(--font-sans)' }}>
          <textPath href="#couple-ring">ARJUN &amp; MEERA • FOREVER • 24.01.2027 •</textPath>
        </text>
      </motion.svg>
      <span aria-hidden className="absolute inset-[22%] rounded-full border border-champagne/40" />
      <span className="absolute inset-0 flex items-center justify-center pb-2 font-serif text-6xl font-light italic text-champagne md:text-7xl">
        &amp;
      </span>
    </motion.div>
  );
}

/** Small spec list; each hairline draws across as its row arrives. */
function Facts({ items }: { items: string[][] }) {
  return (
    <dl className="mt-10 border-t border-charcoal/15">
      {items.map(([term, detail], i) => (
        <motion.div
          key={term}
          className="relative flex items-baseline justify-between gap-6 py-4"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 1.1, ease, delay: i * 0.1 }}
        >
          <dt className="label text-taupe">{term}</dt>
          <dd className="font-serif text-lg italic text-ink/90">{detail}</dd>
          <motion.span
            aria-hidden
            className="absolute bottom-0 left-0 h-px w-full origin-left bg-charcoal/15"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 1.6, ease, delay: 0.2 + i * 0.12 }}
          />
        </motion.div>
      ))}
    </dl>
  );
}

function Profile({ who, italic }: { who: keyof typeof people; italic?: boolean }) {
  const p = people[who];
  return (
    <div>
      <Reveal>
        <p className="label flex items-center gap-4 text-taupe">
          <span aria-hidden className="h-px w-10 bg-taupe/50" />
          {p.role}
        </p>
      </Reveal>
      <h3 className={clsx('display mt-5 text-[clamp(4rem,20vw,6.5rem)] md:text-[clamp(5rem,8vw,9rem)]', italic && 'italic')}>
        <CharReveal text={p.name} delay={0.1} />
      </h3>
      <Reveal delay={0.2}>
        <p className="mt-4 font-serif text-2xl font-light italic text-taupe md:text-[1.7rem]">{p.line}</p>
      </Reveal>
      <Reveal delay={0.3}>
        <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink/70">{p.text}</p>
      </Reveal>
      <Facts items={p.facts} />
    </div>
  );
}

/* ───────────────────────── Section ───────────────────────── */

export function Couple() {
  const stageRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ['start end', 'end start'] });

  const still = (a: string, b: string) => (reduce ? [a, a] : [a, b]);
  // Two depths: the bride drifts slowly, the groom and the accent move faster.
  const brideY = useTransform(scrollYProgress, [0, 1], still('4%', '-6%'));
  const groomY = useTransform(scrollYProgress, [0, 1], still('14%', '-14%'));
  const accentY = useTransform(scrollYProgress, [0, 1], still('40%', '-40%'));
  const bandA = useTransform(scrollYProgress, [0, 1], still('6%', '-28%'));
  const bandB = useTransform(scrollYProgress, [0, 1], still('-28%', '6%'));
  const ringRotate = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-90, 270]);

  return (
    <section id="couple" className="relative overflow-hidden bg-ivory py-28 md:py-40 lg:py-52">
      {/* Header */}
      <div className="gutter flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <Reveal>
            <SectionLabel index="01" className="text-taupe">
              The Couple
            </SectionLabel>
          </Reveal>
          <SplitLines
            as="h2"
            className="display mt-8 text-[clamp(3.25rem,13vw,5.5rem)] md:text-[clamp(5rem,8.5vw,9rem)]"
            lines={['The two', 'of us']}
            lineClassName={(i) => (i === 1 ? 'italic pl-[1.4em]' : undefined)}
          />
        </div>
        <Reveal delay={0.2} className="max-w-xs md:pb-4">
          <p className="text-[15px] leading-relaxed text-ink/70">
            Different cities, different stories — the same sense of humour. Meet the two people at the heart of
            the day.
          </p>
        </Reveal>
      </div>

      {/* Stage */}
      <div ref={stageRef} className="relative mt-20 md:mt-28">
        {/* Oversized outlined names drifting in opposite directions */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[2%] z-0 overflow-hidden">
          <motion.p
            style={{ x: bandA }}
            className="whitespace-nowrap font-serif text-[30vw] font-light italic leading-none text-sand/80 md:text-[22vw]"
          >
            Meera · Meera · Meera
          </motion.p>
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-[18%] z-0 overflow-hidden">
          <motion.p
            style={{ x: bandB }}
            className="whitespace-nowrap font-serif text-[30vw] font-light leading-none text-sand/80 md:text-[22vw]"
          >
            Arjun · Arjun · Arjun
          </motion.p>
        </div>

        <div className="gutter relative z-10 grid grid-cols-12 gap-y-16 md:gap-x-8">
          {/* Bride */}
          <article className="relative col-span-12 md:col-span-6">
            <motion.div style={{ y: brideY }} className="relative">
              <TiltFrame className="aspect-[4/5] w-full">
                <MaskImage
                  src={img.bride}
                  alt="Meera in an ivory lehenga beside a weathered brick wall"
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="h-full w-full"
                  parallax={10}
                  hoverZoom={false}
                />
              </TiltFrame>

              {/* Floating detail, a layer closer to the viewer */}
              <motion.div
                style={{ y: accentY }}
                className="absolute -right-[14%] bottom-[8%] z-20 hidden w-[34%] shadow-[0_30px_60px_-30px_rgba(27,25,22,0.5)] md:block"
              >
                <MaskImage
                  src={img.brideDetail}
                  alt="Meera smiling softly, adorned in bridal jewellery"
                  sizes="18vw"
                  className="aspect-[3/4] w-full"
                  direction="left"
                  delay={0.4}
                  parallax={0}
                />
              </motion.div>
            </motion.div>

            <div className="mt-12 md:mt-16 md:pr-[10%]">
              <Profile who="bride" />
            </div>
          </article>

          {/* Monogram — between the two on phones; above the groom's column on desktop */}
          <div className="col-span-12 flex justify-center md:absolute md:left-[60%] md:top-[3%] md:col-span-1">
            <Monogram rotate={ringRotate} />
          </div>

          {/* Groom */}
          <article className="relative col-span-12 md:col-span-5 md:col-start-8 md:mt-[46vh]">
            <div className="md:pl-[6%]">
              <Profile who="groom" italic />
            </div>
            <motion.div style={{ y: groomY }} className="mt-12 md:mt-16">
              <TiltFrame className="ml-auto aspect-[3/4] w-[88%] md:w-full">
                <MaskImage
                  src={img.groom}
                  alt="Arjun adjusting his tie in a dark tailored suit"
                  sizes="(min-width: 768px) 40vw, 88vw"
                  className="h-full w-full"
                  direction="down"
                  parallax={10}
                  hoverZoom={false}
                />
              </TiltFrame>
            </motion.div>
          </article>
        </div>
      </div>
    </section>
  );
}
