# Arjun & Meera — Wedding Invitation

A cinematic, editorial wedding invitation built with Next.js 15, Tailwind CSS, Framer Motion and Lenis.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Personalising

| What | Where |
| --- | --- |
| Names, date, venue, map links, contact | `lib/content.ts` (`couple`) |
| Events | `lib/content.ts` |
| Photographs | `public/images/*` (same filenames), wired up in `lib/images.ts` |
| Highlight film | add `public/video/highlight.mp4` — until then the player shows “Coming soon” |
| RSVP storage | `app/api/rsvp/route.ts` validates and logs; connect a sheet, database or email there |

Images are imported statically, so Next.js serves them as AVIF/WebP with blur placeholders and lazy loading.

## Structure

- `components/sections/` — Hero, Couple, Events, Countdown, Video, RSVP, Location, FinalCTA, Footer
- `components/motion/` — reusable motion primitives: `MaskImage` (clip reveal + parallax + hover drift), `SplitLines`, `Reveal`, `Magnetic`
- `components/ui/` — Nav, InvitationIntro (sealed-envelope opening), custom Cursor, accessible Overlay, ArrowLink, SectionLabel
- `components/providers/Providers.tsx` — Lenis smooth scroll, reduced-motion config, invitation → hero timing

`prefers-reduced-motion` turns off smooth scrolling, the custom cursor, parallax and transform animations; the invitation still appears but opens without motion.

Photography: Pexels (free licence; venue table shot from Unsplash) — replace with your own shoot.
