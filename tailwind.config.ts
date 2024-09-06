import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        dracula: {
          '50': '#fefeff',
          '100': '#e9dafe',
          '200': '#d3b6fc',
          '300': '#bd93f9',
          '400': '#a771f6',
          '500': '#924ff2',
          '600': '#7d2eed',
          '700': '#6916e0',
          '800': '#5914bb',
          '900': '#491298',
          DEFAULT: '#bd93f9',
        },
        nosferatu: {
          '50': '#cdd0e4',
          '100': '#b5bad6',
          '200': '#9ea4c8',
          '300': '#888fb8',
          '400': '#727aa8',
          '500': '#5f6795',
          '600': '#53597c',
          '700': '#454a64',
          '800': '#373a4d',
          '900': '#282a36',
          DEFAULT: '#282a36',
        },
      },
    },
  },
  darkMode: 'class',
  plugins: [],
};
export default config;
