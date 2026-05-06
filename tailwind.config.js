/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Luxury brand colors
        gold: {
          50: '#fdf8e8',
          100: '#f9edcc',
          200: '#f0d88f',
          300: '#e8c960',
          400: '#d4a843',
          500: '#c9a96e',
          600: '#8b6914',
          700: '#6b4f0f',
          800: '#4a370a',
          900: '#2d2106',
        },
        obsidian: {
          50: '#f5f5f5',
          100: '#e0e0e0',
          200: '#bdbdbd',
          300: '#9e9e9e',
          400: '#757575',
          500: '#424242',
          600: '#2d2d2d',
          700: '#1a1a1a',
          800: '#0f0f0f',
          900: '#0a0a0a',
          950: '#050505',
        },
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          900: '#0c4a6e',
        },
        success: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          600: '#d97706',
        },
        error: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
        '3xs': ['0.5rem', { lineHeight: '0.625rem' }],
        'display': ['4.5rem', { lineHeight: '0.9', letterSpacing: '-0.04em' }],
        'display-sm': ['3rem', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in': 'slideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        'bounce-subtle': 'bounceSubtle 0.6s ease-in-out',
        'float': 'float 6s ease-in-out infinite',
        'morph': 'morph 8s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'spin-slow': 'spin-slow 20s linear infinite',
        'gradient-shift': 'gradient-shift 3s ease infinite',
        'float-3d': 'float-3d 6s ease-in-out infinite',
        'breathe': 'breathe 4s ease-in-out infinite',
        'marquee': 'marquee 30s linear infinite',
        'ping': 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(60px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-2px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '33%': { transform: 'translateY(-15px) rotate(1deg)' },
          '66%': { transform: 'translateY(-8px) rotate(-1deg)' },
        },
        morph: {
          '0%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
          '25%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
          '50%': { borderRadius: '50% 60% 30% 60% / 30% 60% 70% 40%' },
          '75%': { borderRadius: '60% 40% 60% 30% / 70% 30% 50% 60%' },
          '100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 5px rgba(201, 169, 110, 0.5)' },
          '50%': { opacity: '0.7', boxShadow: '0 0 20px rgba(201, 169, 110, 0.8)' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'float-3d': {
          '0%, 100%': { transform: 'translateY(0) rotateX(0) rotateY(0)' },
          '25%': { transform: 'translateY(-10px) rotateX(2deg) rotateY(-2deg)' },
          '50%': { transform: 'translateY(-20px) rotateX(0) rotateY(0)' },
          '75%': { transform: 'translateY(-10px) rotateX(-2deg) rotateY(2deg)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.5' },
          '50%': { transform: 'scale(1.05)', opacity: '0.8' },
        },
      },
      boxShadow: {
        'soft': '0 2px 8px -2px rgba(0, 0, 0, 0.1)',
        'medium': '0 4px 16px -4px rgba(0, 0, 0, 0.1)',
        'large': '0 8px 32px -8px rgba(0, 0, 0, 0.15)',
        'luxury': '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(201, 169, 110, 0.05)',
        'luxury-hover': '0 35px 60px -12px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(201, 169, 110, 0.15), 0 0 60px rgba(201, 169, 110, 0.08)',
        'gold': '0 20px 40px -10px rgba(201, 169, 110, 0.25), 0 0 0 1px rgba(201, 169, 110, 0.1)',
        'gold-intense': '0 20px 60px -10px rgba(201, 169, 110, 0.4), 0 0 80px rgba(201, 169, 110, 0.15)',
        'inner-glow': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
        'premium': '0 4px 6px -1px rgba(0,0,0,0.05), 0 10px 20px -2px rgba(0,0,0,0.06), 0 30px 60px -5px rgba(0,0,0,0.08), 0 0 0 1px rgba(201, 169, 110, 0.03)',
        'ultra': '0 2px 4px rgba(0,0,0,0.02), 0 4px 8px rgba(0,0,0,0.03), 0 8px 16px rgba(0,0,0,0.04), 0 16px 32px rgba(0,0,0,0.05), 0 32px 64px rgba(0,0,0,0.06), 0 64px 128px rgba(0,0,0,0.08)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(var(--tw-gradient-stops))',
        'gradient-luxury': 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
        'gradient-gold': 'linear-gradient(135deg, #8b6914 0%, #c9a96e 50%, #e8d5a3 100%)',
        'mesh': 'radial-gradient(at 40% 20%, rgba(201, 169, 110, 0.05) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(201, 169, 110, 0.03) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(201, 169, 110, 0.02) 0px, transparent 50%)',
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '1200': '1200ms',
      },
    },
  },
  plugins: [],
}