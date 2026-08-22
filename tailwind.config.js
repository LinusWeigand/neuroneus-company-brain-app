import tailwindcssAnimate from 'tailwindcss-animate';

/**
 * The product UI is dark, unlike the marketing site. These tokens name the
 * greys that recur throughout the app chrome so screens stop hard-coding hex
 * values — the palette is lifted from the product mockups on the landing page.
 */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Geist', 'system-ui', 'sans-serif'],
        orbitron: ['Orbitron', 'sans-serif'],
      },
      colors: {
        app: {
          // Page and panel backgrounds, darkest to lightest.
          bg: '#1F1F1E',
          panel: '#2C2C2B',
          raised: '#2E2E2E',
          sunken: '#1E1E1D',
          input: '#262626',
          hover: '#242424',
          border: '#3D3D3D',
          'border-soft': '#3D3D3B',
          text: '#FAFAFA',
          muted: '#8C8C8C',
          accent: '#0044ff',
        },
      },
      keyframes: {
        spinMark: { '0%': { transform: 'rotate(0)' }, '100%': { transform: 'rotate(360deg)' } },
      },
      animation: { spinMark: 'spinMark 1s linear infinite' },
    },
  },
  plugins: [tailwindcssAnimate],
};
