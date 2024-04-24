/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'theme-background': {
          DEFAULT: '#ffffff', // 기본 배경색
          dark: '#1a202c', // 다크 모드에서의 배경색
        },
        'theme-text': {
          DEFAULT: '#1f2937', // 기본 텍스트 색상
          dark: '#ffffff', // 다크 모드에서의 텍스트 색상
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
  darkMode: 'selector',
};
