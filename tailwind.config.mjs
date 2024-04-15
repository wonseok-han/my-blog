/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      boxShadow: {
        top: '0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)',
        'top-dark':
          '0 -4px 6px -1px rgba(128, 128, 128, 0.1), 0 -2px 4px -1px rgba(128, 128, 128, 0.06)',
      },
      colors: {
        dark: {},
      },
    },
  },
  variants: {
    extend: {
      boxShadow: ['dark'],
    },
  },
  plugins: [],
  darkMode: 'selector',
};
