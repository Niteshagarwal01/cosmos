/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cl: {
          bg:      '#000000',
          surface: '#0c0c0c',
          border:  '#1c1c1c',
          line:    '#2a2a2a',
          text:    '#e8e6e3',
          muted:   '#555',
          dim:     '#333',
          lime:    '#c8ff00',
          blue:    '#3d7fff',
          green:   '#00d084',
          pink:    '#ff3d7f',
        },
      },
      fontFamily: {
        display: ['Syne', 'system-ui', 'sans-serif'],
        sans:    ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
