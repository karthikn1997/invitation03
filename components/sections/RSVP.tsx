'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, Minus, Plus } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Reveal } from '@/components/motion/Reveal';
import { SplitLines } from '@/components/motion/SplitLines';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { img } from '@/lib/images';
import { ease } from '@/lib/motion';

const REPLY_BY = new Date('2026-12-01T23:59:59+05:30');
const MAX_GUESTS = 5;

type Attending = 'yes' | 'no' | '';
type Data = { attending: Attending; name: string; email: string; phone: string; guests: number; message: string };
type Errors = Partial<Record<'attending' | 'name' | 'email', string>>;

const steps = ['Will you join us?', 'Your details', 'A note for us'];

/* ───────────────────────── Form pieces ───────────────────────── */

function ErrorText({ id, children }: { id: string; children?: string }) {
  return (
    <AnimatePresence>
      {children && (
        <motion.p
          id={id}
          className="mt-2 text-xs text-rose"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease }}
        >
          {children}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

/** Underlined field with a floating label and a hairline that draws across on focus. */
function Field({
  id,
  label,
  value,
  onChange,
  type = 'text',
  error,
  textarea,
  autoComplete,
  inputMode,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  error?: string;
  textarea?: boolean;
  autoComplete?: string;
  inputMode?: 'text' | 'email' | 'tel';
}) {
  const shared = {
    id,
    name: id,
    value,
    placeholder: ' ',
    autoComplete,
    onChange: (e: { target: { value: string } }) => onChange(e.target.value),
    'aria-invalid': !!error,
    'aria-describedby': error ? `${id}-error` : undefined,
    className:
      'peer block w-full resize-none rounded-none border-0 border-b border-charcoal/20 bg-transparent pb-3 pt-7 text-base text-charcoal outline-none',
  };
  return (
    <div>
      <label className="relative block">
        {textarea ? <textarea rows={4} {...shared} /> : <input type={type} inputMode={inputMode} {...shared} />}
        <span className="label pointer-events-none absolute left-0 top-7 origin-left text-taupe transition-all duration-500 ease-lux peer-focus:top-0 peer-focus:text-[10px] peer-focus:text-charcoal peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-[10px]">
          {label}
        </span>
        <span
          aria-hidden
          className={clsx(
            'absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-700 ease-lux peer-focus:scale-x-100',
            error ? 'bg-rose' : 'bg-charcoal',
          )}
        />
      </label>
      <ErrorText id={`${id}-error`}>{error}</ErrorText>
    </div>
  );
}

function Choice({
  selected,
  onSelect,
  title,
  sub,
}: {
  selected: boolean;
  onSelect: () => void;
  title: string;
  sub: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={clsx(
        'group relative flex w-full items-center justify-between gap-6 overflow-hidden rounded-[20px] border px-6 py-6 text-left transition-colors duration-700 ease-lux md:px-8 md:py-7',
        selected ? 'border-charcoal bg-charcoal text-ivory' : 'border-charcoal/15 bg-white/40 hover:border-charcoal/40',
      )}
    >
      <span>
        <span className="block font-serif text-[1.9rem] font-light leading-tight md:text-[2.2rem]">{title}</span>
        <span className={clsx('label mt-2 block', selected ? 'text-ivory/60' : 'text-taupe')}>{sub}</span>
      </span>
      <span
        aria-hidden
        className={clsx(
          'relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border transition-colors duration-700',
          selected ? 'border-champagne' : 'border-charcoal/25 group-hover:border-charcoal/50',
        )}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4">
          <motion.path
            d="M5 12.5l4.2 4.2L19 7"
            fill="none"
            stroke="#C9B697"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={false}
            animate={{ pathLength: selected ? 1 : 0, opacity: selected ? 1 : 0 }}
            transition={{ duration: 0.7, ease }}
          />
        </svg>
      </span>
    </button>
  );
}

function GuestStepper({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const btn =
    'flex h-11 w-11 items-center justify-center rounded-full border border-charcoal/20 transition-colors duration-500 hover:bg-charcoal hover:text-ivory disabled:pointer-events-none disabled:opacity-30';
  return (
    <div className="flex items-center justify-between border-b border-charcoal/20 pb-3 pt-2">
      <span className="label text-taupe">Number of guests</span>
      <div className="flex items-center gap-5">
        <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="Fewer guests">
          <Minus strokeWidth={1.25} className="h-4 w-4" />
        </button>
        <span aria-live="polite" className="nums relative inline-flex h-10 w-8 items-center justify-center overflow-hidden font-serif text-3xl">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              key={value}
              initial={{ y: '80%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              exit={{ y: '-80%', opacity: 0 }}
              transition={{ duration: 0.5, ease }}
            >
              {value}
            </motion.span>
          </AnimatePresence>
        </span>
        <button
          type="button"
          className={btn}
          onClick={() => onChange(value + 1)}
          disabled={value >= MAX_GUESTS}
          aria-label="More guests"
        >
          <Plus strokeWidth={1.25} className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/** A seal that draws itself, then the check. */
function Seal() {
  return (
    <svg viewBox="0 0 120 120" className="h-28 w-28" aria-hidden>
      <motion.circle
        cx="60"
        cy="60"
        r="54"
        fill="none"
        stroke="#C9B697"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.6, ease }}
      />
      <motion.circle
        cx="60"
        cy="60"
        r="44"
        fill="#1B1916"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{ originX: '60px', originY: '60px' }}
        transition={{ duration: 0.9, ease, delay: 0.7 }}
      />
      <motion.path
        d="M42 61l12 12 25-27"
        fill="none"
        stroke="#F7F3EC"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, ease, delay: 1.3 }}
      />
    </svg>
  );
}

/* ───────────────────────── Section ───────────────────────── */

export function RSVP() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [errors, setErrors] = useState<Errors>({});
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [data, setData] = useState<Data>({ attending: '', name: '', email: '', phone: '', guests: 1, message: '' });

  const set = <K extends keyof Data>(key: K, value: Data[K]) => setData((d) => ({ ...d, [key]: value }));

  useEffect(() => {
    setDaysLeft(Math.max(0, Math.ceil((REPLY_BY.getTime() - Date.now()) / 86_400_000)));
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-8%', '8%']);

  const go = (to: number) => {
    setDir(to > step ? 1 : -1);
    setStep(to);
  };

  const validate = (s: number) => {
    const next: Errors = {};
    if (s === 0 && !data.attending) next.attending = 'Let us know if you can make it.';
    if (s === 1) {
      if (!data.name.trim()) next.name = 'Please tell us your name.';
      if (!/^\S+@\S+\.\S+$/.test(data.email)) next.email = 'Please enter a valid email.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const choose = (value: 'yes' | 'no') => {
    set('attending', value);
    setErrors({});
    window.setTimeout(() => go(1), 550);
  };

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (step < 2) {
      if (validate(step)) go(step + 1);
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, guests: String(data.attending === 'yes' ? data.guests : 0) }),
      });
      if (!res.ok) throw new Error();
      setStatus('done');
    } catch {
      setStatus('error');
    }
  }

  const firstName = data.name.trim().split(' ')[0];

  return (
    <section ref={sectionRef} id="rsvp" className="relative overflow-hidden bg-cream py-28 md:py-40 lg:py-48">
      <div aria-hidden className="pointer-events-none absolute -right-[15%] top-[10%] h-[60vh] w-[60vw] rounded-full bg-[radial-gradient(closest-side,rgba(201,182,151,0.22),transparent)]" />

      <div className="gutter relative">
        {/* Header */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Reveal>
              <SectionLabel index="05" className="text-taupe">
                RSVP
              </SectionLabel>
            </Reveal>
            <SplitLines
              as="h2"
              className="mt-8 font-serif text-[clamp(2.6rem,10.5vw,4rem)] font-light uppercase leading-[0.95] tracking-[0.01em] md:text-[clamp(3.5rem,6.5vw,6.5rem)]"
              lines={['We’d love to', <span key="c" className="normal-case italic">celebrate with you</span>]}
            />
          </div>
          <Reveal delay={0.2} className="max-w-xs lg:pb-3">
            <p className="text-[15px] leading-relaxed text-ink/70">
              Your reply helps us plan every detail of the evening. It takes less than a minute.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-10 md:mt-24 lg:grid-cols-12 lg:gap-10">
          {/* Photo panel */}
          <motion.div
            className="relative aspect-[4/3] overflow-hidden rounded-[28px] sm:aspect-[16/10] lg:col-span-5 lg:aspect-auto lg:min-h-[640px]"
            initial={{ clipPath: 'inset(10% 10% 10% 10% round 28px)', opacity: 0 }}
            whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 28px)', opacity: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 1.6, ease }}
          >
            <motion.div className="absolute inset-x-0 -bottom-[10%] -top-[10%]" style={{ y: imageY }}>
              <Image
                src={img.rsvpBg}
                alt="Arjun and Meera on a long bridge at dusk"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                placeholder="blur"
                className="object-cover"
              />
            </motion.div>
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-6 text-ivory md:p-10">
              <div>
                <p className="label text-ivory/70">Kindly reply by</p>
                <p className="nums mt-3 whitespace-nowrap font-serif text-[2rem] font-light tracking-[0.06em] md:text-[2.4rem] lg:text-[2.1rem] xl:text-[2.6rem]">01 · 12 · 2026</p>
              </div>
              {daysLeft !== null && (
                <motion.p
                  className="label rounded-full border border-ivory/30 px-4 py-2 text-ivory/90 backdrop-blur-sm"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease, delay: 0.6 }}
                >
                  <span className="nums">{daysLeft}</span> days left
                </motion.p>
              )}
            </div>
          </motion.div>

          {/* Reply card */}
          <motion.div
            className="relative flex flex-col rounded-[28px] border border-white/80 bg-white/50 p-6 shadow-[0_40px_90px_-50px_rgba(27,25,22,0.45)] backdrop-blur-xl xs:p-8 md:p-12 lg:col-span-7"
            initial={{ opacity: 0, y: 60, filter: 'blur(12px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.5, ease, delay: 0.15 }}
          >
            {status !== 'done' && (
              <div className="flex items-center justify-between">
                <p className="font-serif text-xl tracking-[0.35em] text-charcoal">R.S.V.P</p>
                <p className="label nums text-taupe">
                  0{step + 1} <span className="mx-2 text-taupe/50">/</span> 03
                </p>
              </div>
            )}
            {status !== 'done' && (
              <div className="relative mt-5 h-px w-full bg-charcoal/10">
                <motion.span
                  className="absolute inset-y-0 left-0 bg-charcoal"
                  animate={{ width: `${((step + 1) / 3) * 100}%` }}
                  transition={{ duration: 1, ease }}
                />
              </div>
            )}

            <AnimatePresence mode="wait" initial={false}>
              {status === 'done' ? (
                <motion.div
                  key="thanks"
                  role="status"
                  className="flex min-h-[520px] flex-col items-center justify-center text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease }}
                >
                  <Seal />
                  <p className="label mt-10 text-taupe">Received with love</p>
                  <p className="display mt-5 text-6xl italic md:text-7xl">
                    Thank you{firstName ? `, ${firstName}` : ''}
                  </p>
                  <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-ink/70">
                    {data.attending === 'no'
                      ? 'We’ll miss you dearly — and we’ll raise a glass in your honour.'
                      : `We’ve saved ${data.guests === 1 ? 'a seat' : `${data.guests} seats`} for you. We can’t wait to see you in Chennai.`}
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  noValidate
                  onSubmit={submit}
                  className="flex flex-1 flex-col"
                  exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
                  transition={{ duration: 0.6, ease }}
                >
                  <div className="relative mt-10 flex-1 overflow-hidden md:mt-12">
                    <AnimatePresence mode="wait" custom={dir} initial={false}>
                      <motion.div
                        key={step}
                        custom={dir}
                        variants={{
                          enter: (d: number) => ({ opacity: 0, x: d * 50, filter: 'blur(8px)' }),
                          center: { opacity: 1, x: 0, filter: 'blur(0px)' },
                          exit: (d: number) => ({ opacity: 0, x: d * -50, filter: 'blur(8px)' }),
                        }}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.7, ease }}
                      >
                        <h3 className="display text-[clamp(2.5rem,9vw,3.25rem)] md:text-[3.75rem]">
                          {step === 0 ? (
                            <>
                              Will you <span className="italic">join us?</span>
                            </>
                          ) : step === 1 ? (
                            <>
                              Your <span className="italic">details</span>
                            </>
                          ) : (
                            <>
                              A note <span className="italic">for us</span>
                            </>
                          )}
                        </h3>

                        {step === 0 && (
                          <div role="radiogroup" aria-label={steps[0]} className="mt-10 space-y-4">
                            <Choice
                              selected={data.attending === 'yes'}
                              onSelect={() => choose('yes')}
                              title="Joyfully accepts"
                              sub="Count me in"
                            />
                            <Choice
                              selected={data.attending === 'no'}
                              onSelect={() => choose('no')}
                              title="Regretfully declines"
                              sub="Celebrating from afar"
                            />
                            <ErrorText id="attending-error">{errors.attending}</ErrorText>
                          </div>
                        )}

                        {step === 1 && (
                          <div className="mt-10 space-y-8">
                            <Field id="name" label="Full name" autoComplete="name" value={data.name} onChange={(v) => set('name', v)} error={errors.name} />
                            <div className="grid gap-8 md:grid-cols-2">
                              <Field
                                id="email"
                                label="Email"
                                type="email"
                                inputMode="email"
                                autoComplete="email"
                                value={data.email}
                                onChange={(v) => set('email', v)}
                                error={errors.email}
                              />
                              <Field
                                id="phone"
                                label="Phone (optional)"
                                type="tel"
                                inputMode="tel"
                                autoComplete="tel"
                                value={data.phone}
                                onChange={(v) => set('phone', v)}
                              />
                            </div>
                            {data.attending === 'yes' && (
                              <GuestStepper value={data.guests} onChange={(n) => set('guests', n)} />
                            )}
                          </div>
                        )}

                        {step === 2 && (
                          <div className="mt-10 space-y-8">
                            <Field
                              id="message"
                              label="Wishes, song requests or dietary notes"
                              textarea
                              value={data.message}
                              onChange={(v) => set('message', v)}
                            />
                            <div className="rounded-[18px] border border-charcoal/10 bg-ivory/60 px-5 py-4">
                              <p className="label text-taupe">Your reply</p>
                              <p className="mt-2 font-serif text-xl italic text-ink/90">
                                {data.name || 'Guest'} ·{' '}
                                {data.attending === 'yes'
                                  ? `joyfully accepts · ${data.guests} ${data.guests === 1 ? 'guest' : 'guests'}`
                                  : 'regretfully declines'}
                              </p>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <div className="mt-12 flex flex-col-reverse gap-5 sm:flex-row sm:items-center sm:justify-between">
                    {step > 0 ? (
                      <button
                        type="button"
                        onClick={() => go(step - 1)}
                        className="group flex min-h-[44px] items-center gap-3 self-start text-[11px] uppercase tracking-[0.28em] text-taupe transition-colors duration-500 hover:text-charcoal"
                      >
                        <ArrowLeft strokeWidth={1.25} className="h-4 w-4 transition-transform duration-500 ease-lux group-hover:-translate-x-1" />
                        Back
                      </button>
                    ) : (
                      <span className="label hidden text-taupe/70 sm:block">Choose one to continue</span>
                    )}
                    {step > 0 && (
                      <ArrowLink type="submit" disabled={status === 'sending'} className="w-full justify-center sm:w-auto">
                        {step < 2 ? 'Continue' : status === 'sending' ? 'Sending…' : 'Confirm RSVP'}
                      </ArrowLink>
                    )}
                  </div>
                  {status === 'error' && (
                    <p role="alert" className="mt-4 text-xs text-rose">
                      Something went wrong — please try again.
                    </p>
                  )}
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
