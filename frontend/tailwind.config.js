/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Placeholder palette — swap freely, this is not the final design pass.
        'nebula-bg': '#0a0a14',
        'nebula-surface': '#12121f',
        'nebula-accent': '#8b5cf6',
        'nebula-glow': '#a78bfa',
        'nebula-text': '#e5e5f0',
        'nebula-cyan': '#67e8f9',
        'nebula-silver': '#c7c9d9',
      },
      fontFamily: {
        display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 40px rgba(167, 139, 250, 0.35)',
        'glow-cyan': '0 0 40px rgba(103, 232, 249, 0.3)',
      },
    },
  },
  plugins: [],
};
