import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // 기본 색상은 @theme inline에서 처리
        // 커스텀 색상만 유지
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
      fontFamily: {
        aggro: ['Aggro', 'sans-serif'],
        sans: ['Aggro', 'sans-serif'],
      },
      fontSize: {
        '2xl': 'var(--text-2xl)',
        xl: 'var(--text-xl)',
        lg: 'var(--text-lg)',
        base: 'var(--text-base)',
      },
      fontWeight: {
        medium: 'var(--font-weight-medium)',
        normal: 'var(--font-weight-normal)',
        light: 'var(--font-weight-light)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        spin: 'spin 1s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  darkMode: 'class',
  plugins: [],
};
export default config;
