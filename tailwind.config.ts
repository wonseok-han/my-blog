import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // 기존 색상 유지
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
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
};
export default config;
