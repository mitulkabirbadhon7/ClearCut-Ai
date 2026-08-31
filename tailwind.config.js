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
        background: '#020617', // Dark background
        card: {
          DEFAULT: '#0F172A',  // Card surface
          elevated: '#172033', // Elevated card
          hover: '#1E293B',
        },
        primary: {
          DEFAULT: '#0EA5E9',  // Primary blue
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
          primary: '#F8FAFC',
          secondary: '#CBD5E1',
          muted: '#94A3B8',
        },
        status: {
          success: '#22C55E',
          warning: '#F59E0B',
          error: '#EF4444',
        },
        border: {
          subtle: '#1E293B',
          DEFAULT: '#334155',
          highlight: '#475569',
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
