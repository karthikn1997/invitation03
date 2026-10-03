import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#F7F3EC',
        cream: '#EFE8DC',
        sand: '#E5DBCC',
        charcoal: '#1B1916',
        ink: '#2C2925',
        champagne: '#C9B697',
        beige: '#D6C8B4',
        taupe: '#958676',
        rose: '#C4A39B',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      transitionTimingFunction: {
        lux: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      screens: {
        xs: '420px',
      },
    },
  },
  plugins: [],
} satisfies Config;
