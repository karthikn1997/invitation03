import type Lenis from 'lenis';

let lenis: Lenis | null = null;
let locks = 0;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
  if (lenis && locks > 0) lenis.stop();
}

export function scrollToTarget(target: string | number) {
  if (lenis) {
    lenis.scrollTo(target, { duration: 2, easing: (t) => 1 - Math.pow(1 - t, 4) });
    return;
  }
  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: 'smooth' });
  } else {
    document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
  }
}

/** Reference-counted scroll lock shared by the preloader, menu and overlays. */
export function lockScroll(lock: boolean) {
  locks = Math.max(0, locks + (lock ? 1 : -1));
  const locked = locks > 0;
  document.documentElement.style.overflow = locked ? 'hidden' : '';
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
}
