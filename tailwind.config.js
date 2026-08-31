/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        card: {
          DEFAULT: 'var(--color-card)',
          elevated: 'var(--color-card-elevated)',
          hover: 'var(--color-card-hover)',
        },
        primary: {
          DEFAULT: '#0EA5E9',
          hover: '#0284C7',
          foreground: '#F8FAFC',
        },
        brand: {
          cyan: '#22D3EE',
          blue: '#2563EB',
          purple: '#7C3AED',
          pink: '#D946EF',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)',
        },
        status: {
          success: '#22C55E',
          warning: '#F59E0B',
          error: '#EF4444',
        },
        border: {
          subtle: 'var(--color-border-subtle)',
          DEFAULT: 'var(--color-border-default)',
          highlight: 'var(--color-border-highlight)',
        },
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #22D3EE 0%, #2563EB 35%, #7C3AED 70%, #D946EF 100%)',
        'brand-gradient-hover': 'linear-gradient(135deg, #38BDF8 0%, #3B82F6 35%, #8B5CF6 70%, #E879F9 100%)',
        'card-glow': 'radial-gradient(ellipse at top, rgba(14, 165, 233, 0.15), transparent 70%)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
