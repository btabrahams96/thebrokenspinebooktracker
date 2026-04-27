/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F2E8D5',
        'paper-light': '#FAF3E3',
        'paper-deep': '#E8DCC4',
        burgundy: '#6B1F2E',
        'burgundy-deep': '#4F1622',
        'burgundy-light': '#8B2E3F',
        forest: '#2D4A3E',
        'forest-deep': '#1F3329',
        'forest-light': '#3F6253',
        ink: '#1A1410',
        sepia: '#8B7456',
        'sepia-light': '#B5A082',
        line: 'rgba(26, 20, 16, 0.12)',
        'line-soft': 'rgba(26, 20, 16, 0.06)'
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      }
    }
  },
  plugins: []
};
