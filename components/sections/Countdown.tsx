'use client';

import { AnimatePresence, motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { CalendarPlus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Reveal } from '@/components/motion/Reveal';
import { SplitLines } from '@/components/motion/SplitLines';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { couple } from '@/lib/content';
import { ease } from '@/lib/motion';

type Remaining = { days: number; hours: number; minutes: number; seconds: number; done: boolean };

function getRemaining(target: number): Remaining {
  const diff = Math.max(0, target - Date.now());
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor(diff / 3_600_000) % 24,
    minutes: Math.floor(diff / 60_000) % 60,
    seconds: Math.floor(diff / 1000) % 60,
    done: diff === 0,
  };
}

/* ───────────────────────── Calendar helpers ───────────────────────── */

const title = `${couple.groom} & ${couple.bride} — Wedding`;
const where = `${couple.venue}, ${couple.city}`;
// 6:30 PM IST → 13:00 UTC; the evening runs until midnight IST.
const startUTC = '20270124T130000Z';
const endUTC = '20270124T183000Z';

const googleCalendarUrl =
  'https://calendar.google.com/calendar/render?action=TEMPLATE' +
  `&text=${encodeURIComponent(title)}` +
  `&dates=${startUTC}/${endUTC}` +
  `&location=${encodeURIComponent(where)}` +
  `&details=${encodeURIComponent('Ceremony 6:30 PM · Reception 8:00 PM · Dinner 9:00 PM')}`;

function downloadICS() {
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Arjun & Meera//Wedding//EN',
    'BEGIN:VEVENT',
    `UID:arjun-meera-${startUTC}@wedding`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
    `DTSTART:${startUTC}`,
    `DTEND:${endUTC}`,
    `SUMMARY:${title}`,
    `LOCATION:${where.replace(/,/g, '\\,')}`,
    'DESCRIPTION:Ceremony 6:30 PM · Reception 8:00 PM · Dinner 9:00 PM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = 'arjun-meera-wedding.ics';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* ───────────────────────── Digits & rings ───────────────────────── */

/** Each digit rolls independently, so only the figures that change move. */
function Digit({ value }: { value: string }) {
  return (
    <span className="relative inline-block overflow-hidden">
      <span className="invisible">0</span>
      <AnimatePresence initial={false}>
        <motion.span
          key={value}
          className="absolute inset-0 text-center"
          initial={{ y: '70%', opacity: 0, filter: 'blur(6px)' }}
          animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: '-70%', opacity: 0, filter: 'blur(6px)' }}
          transition={{ duration: 0.9, ease }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/** Fine progress ring with a small bead riding the end of the arc. */
function Ring({ fraction, index, visible }: { fraction: number; index: number; visible: boolean }) {
  const last = useRef(fraction);
  // When a unit wraps (e.g. seconds 0 → 59) jump instead of sweeping backwards.
  const wrapped = fraction - last.current > 0.5;
  useEffect(() => {
    last.current = fraction;
  }, [fraction]);

  const shown = visible ? fraction : 0;
  const t = wrapped ? { duration: 0 } : { duration: 0.9, ease };

  return (
    <>
      <svg aria-hidden viewBox="0 0 200 200" className="absolute inset-0 h-full w-full -rotate-90 overflow-visible">
        <circle cx="100" cy="100" r="94" fill="none" stroke="rgb(27 25 22 / 0.08)" strokeWidth="1" />
        <motion.circle
          cx="100"
          cy="100"
          r="94"
          fill="none"
          stroke="rgb(27 25 22 / 0.75)"
          strokeWidth="1.25"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: shown }}
          transition={t}
        />
      </svg>
      {/* Bead rides the arc's end: an HTML layer rotates cleanly about the ring's centre. */}
      <motion.div
        aria-hidden
        className="absolute inset-0"
        initial={{ rotate: 0 }}
        animate={{ rotate: shown * 360 }}
        transition={t}
      >
        <span className="absolute left-1/2 top-[3%] h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-champagne">
          <span
            className="absolute inset-0 animate-seal rounded-full border border-champagne"
            style={{ animationDelay: `${index * 0.4}s` }}
          />
        </span>
      </motion.div>
    </>
  );
}

function Unit({
  value,
  max,
  label,
  index,
}: {
  value: number | null;
  max: number;
  label: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { once: true, amount: 0.5 });
  const text = value === null ? '––' : String(value).padStart(2, '0');
  const fraction = value === null ? 0 : Math.min(1, value / max);

  return (
    <motion.div
      ref={ref}
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 40, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 1.4, ease, delay: index * 0.12 }}
    >
      <div className="relative flex aspect-square w-[min(40vw,170px)] items-center justify-center md:w-[min(19vw,230px)]">
        <Ring fraction={fraction} index={index} visible={visible} />
        <span className="display nums text-[clamp(2.75rem,12vw,4rem)] leading-none md:text-[clamp(3.5rem,6vw,5.5rem)]">
          {text.split('').map((d, i) => (
            <Digit key={`${text.length}-${i}`} value={d} />
          ))}
        </span>
      </div>
      <span className="label mt-6 text-taupe">{label}</span>
    </motion.div>
  );
}

/* ───────────────────────── Calendar card ───────────────────────── */

// January 2027 starts on a Friday; weeks begin on Monday.
const LEADING_BLANKS = 4;
const DAYS_IN_MONTH = 31;
const WEDDING_DAY = 24;

function CalendarCard() {
  const cells = [...Array(LEADING_BLANKS).fill(null), ...Array.from({ length: DAYS_IN_MONTH }, (_, i) => i + 1)];

  return (
    <motion.div
      className="relative rounded-[24px] border border-charcoal/10 bg-ivory/70 p-6 shadow-[0_40px_80px_-50px_rgba(27,25,22,0.4)] backdrop-blur-xl xs:p-8 md:p-10"
      initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.4, ease }}
    >
      <div className="flex items-baseline justify-between border-b border-charcoal/10 pb-5">
        <p className="font-serif text-3xl font-light italic md:text-4xl">January</p>
        <p className="label nums text-taupe">2027</p>
      </div>

      <div className="mt-6 grid grid-cols-7 gap-y-1 text-center">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <span key={i} className="label pb-3 text-[10px] text-taupe/80">
            {d}
          </span>
        ))}
        {cells.map((day, i) =>
          day === null ? (
            <span key={`b${i}`} />
          ) : (
            <motion.span
              key={day}
              className={`nums relative flex aspect-square items-center justify-center font-serif text-lg md:text-xl ${
                day === WEDDING_DAY ? 'text-charcoal' : 'font-light text-ink/55'
              }`}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, ease, delay: 0.3 + i * 0.018 }}
            >
              {day}
              {day === WEDDING_DAY && (
                <svg aria-hidden viewBox="0 0 100 100" className="absolute -inset-1 h-[calc(100%+0.5rem)] w-[calc(100%+0.5rem)] overflow-visible">
                  <motion.path
                    d="M 54 10 C 84 9, 96 34, 90 58 C 83 84, 38 92, 17 74 C -1 58, 6 22, 38 12 C 46 10, 58 9, 64 12"
                    fill="none"
                    stroke="#C9B697"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true, amount: 1 }}
                    transition={{ duration: 1.8, ease, delay: 1.1 }}
                  />
                </svg>
              )}
            </motion.span>
          ),
        )}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-charcoal/10 pt-5">
        <p className="label text-taupe">Sunday</p>
        <p className="font-serif text-lg italic text-ink/80">The day we say forever</p>
      </div>
    </motion.div>
  );
}

/* ───────────────────────── Section ───────────────────────── */

export function Countdown() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [time, setTime] = useState<Remaining | null>(null);

  useEffect(() => {
    const target = new Date(couple.dateISO).getTime();
    setTime(getRemaining(target));
    const id = window.setInterval(() => setTime(getRemaining(target)), 1000);
    return () => clearInterval(id);
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const band = useTransform(scrollYProgress, [0, 1], reduce ? ['-10%', '-10%'] : ['0%', '-30%']);

  const units: { key: 'days' | 'hours' | 'minutes' | 'seconds'; label: string; max: number }[] = [
    { key: 'days', label: 'Days', max: 365 },
    { key: 'hours', label: 'Hours', max: 24 },
    { key: 'minutes', label: 'Minutes', max: 60 },
    { key: 'seconds', label: 'Seconds', max: 60 },
  ];

  return (
    <section ref={ref} aria-label="Countdown to the wedding" className="relative overflow-hidden bg-cream py-28 md:py-40">
      {/* Drifting “save the date” band */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[38%] overflow-hidden md:top-[26%]">
        <motion.p
          style={{ x: band }}
          className="whitespace-nowrap font-serif text-[26vw] font-light italic leading-none text-sand/70 md:text-[15vw]"
        >
          Save the date · 24 · 01 · 2027 · Save the date ·
        </motion.p>
      </div>

      <div className="gutter relative">
        <div className="flex flex-col items-center text-center">
          <Reveal>
            <SectionLabel index="03" className="text-taupe">
              Countdown
            </SectionLabel>
          </Reveal>
          <SplitLines
            as="h2"
            className="mt-8 font-sans text-[13px] font-medium uppercase tracking-[0.42em] md:text-sm"
            lines={[time?.done ? 'Today is the day' : 'The day is almost here']}
          />
        </div>

        <div role="timer" aria-live="off" className="mx-auto mt-16 grid max-w-6xl grid-cols-2 gap-x-4 gap-y-12 md:mt-24 md:grid-cols-4">
          {units.map(({ key, label, max }, i) => (
            <Unit key={key} value={time ? time[key] : null} max={max} label={label} index={i} />
          ))}
        </div>

        {/* Save the date */}
        <div className="mx-auto mt-24 grid max-w-6xl items-center gap-14 md:mt-32 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-5">
            <CalendarCard />
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <Reveal>
              <p className="label text-taupe">Save the date</p>
            </Reveal>
            <SplitLines
              as="p"
              className="display mt-6 text-[clamp(2.75rem,11vw,4rem)] md:text-[clamp(3.25rem,5vw,5.25rem)]"
              lines={['Sunday,', <span key="d" className="italic">24 January 2027</span>]}
              delay={0.1}
            />
            <Reveal delay={0.25}>
              <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink/70">
                From 6:30 in the evening at {couple.venue}, {couple.city}. Pop it in your calendar — we’d hate for you
                to miss a moment.
              </p>
            </Reveal>
            <Reveal delay={0.35} className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <ArrowLink onClick={downloadICS} icon={<CalendarPlus strokeWidth={1.25} className="h-4 w-4" />}>
                Add to calendar
              </ArrowLink>
              <ArrowLink href={googleCalendarUrl} external variant="text">
                Google Calendar
              </ArrowLink>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
