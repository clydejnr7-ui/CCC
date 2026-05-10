/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: { 900: '#020817', 800: '#0a0f1e', 700: '#0f1729', 600: '#141f35', 500: '#1a2540' },
        gold: { 400: '#fbbf24', 500: '#f59e0b', 600: '#d97706' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'radial-gradient(ellipse 80% 60% at 50% -20%, rgba(34,197,94,0.15), transparent)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-10px)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        rabbitBodyBob: { '0%, 100%': { transform: 'scaleY(1) translateY(0)' }, '50%': { transform: 'scaleY(0.92) translateY(2px)' } },
        rabbitEarWiggle: { '0%, 100%': { transform: 'rotate(0deg)' }, '25%': { transform: 'rotate(-8deg)' }, '75%': { transform: 'rotate(8deg)' } },
        rabbitLegCycle: { '0%': { transform: 'rotate(20deg)' }, '50%': { transform: 'rotate(-20deg)' }, '100%': { transform: 'rotate(20deg)' } },
        rabbitLegCycleReverse: { '0%': { transform: 'rotate(-20deg)' }, '50%': { transform: 'rotate(20deg)' }, '100%': { transform: 'rotate(-20deg)' } },
      },
    },
  },
  plugins: [],
};
