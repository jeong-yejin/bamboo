/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        dark: '#0a0a0a',
        'dark-card': 'rgba(255,255,255,0.06)',
        'dark-border': 'rgba(255,255,255,0.10)',
        'text-primary': '#f0f0f0',
        'text-muted': 'rgba(255,255,255,0.50)',
        'text-faint': 'rgba(255,255,255,0.28)',
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'serif'],
      },
      letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.03em',
        snug: '-0.02em',
      },
      backdropBlur: {
        xs: '4px',
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: '0', filter: 'blur(4px)', transform: 'translateY(10px)' },
          to:   { opacity: '1', filter: 'blur(0)',   transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeInUp: 'fadeInUp 0.5s ease forwards',
      },
    },
  },
  plugins: [],
}
