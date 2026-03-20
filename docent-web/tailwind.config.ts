import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', '바탕', 'serif'],
        sans: ['var(--font-sans)', 'Apple SD Gothic Neo', 'Malgun Gothic', 'sans-serif'],
      },
      colors: {
        // 전시 브랜드 팔레트
        gold: {
          DEFAULT: '#C9A84C',
          light: '#E0C97A',
          dark: '#9A7A2E',
        },
        garden: {
          bg: '#0A0F14',
          surface: '#111820',
          border: 'rgba(201,168,76,0.2)',
        },
        // 존별 액센트
        zone: {
          0: '#7C3AED', // preshow — 보라
          1: '#D97706', // golden-garden — 황금
          2: '#2563EB', // raindrop-garden — 파랑
          3: '#DB2777', // flower-whisper — 핑크
          4: '#7C5CFC', // flower-nap — 라벤더
          post: '#059669', // butterfly-forest — 에메랄드
        },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #C9A84C 0%, #E0C97A 50%, #9A7A2E 100%)',
      },
      keyframes: {
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)', opacity: '0.3' },
          '50%': { transform: 'translateY(-30px) translateX(15px)', opacity: '0.8' },
        },
        'float-medium': {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)', opacity: '0.2' },
          '33%': { transform: 'translateY(-20px) translateX(-20px)', opacity: '0.7' },
          '66%': { transform: 'translateY(-40px) translateX(10px)', opacity: '0.5' },
        },
        'float-fast': {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px) scale(1)', opacity: '0.15' },
          '50%': { transform: 'translateY(-50px) translateX(-10px) scale(1.2)', opacity: '0.6' },
        },
        'pulse-pin': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.6)', opacity: '0' },
        },
        'wave': {
          '0%, 100%': { transform: 'scaleY(0.4)' },
          '50%': { transform: 'scaleY(1.0)' },
        },
        'glow': {
          '0%, 100%': { boxShadow: '0 0 8px 2px rgba(201,168,76,0.4)' },
          '50%': { boxShadow: '0 0 20px 6px rgba(201,168,76,0.8)' },
        },
      },
      animation: {
        'float-slow': 'float-slow 8s ease-in-out infinite',
        'float-medium': 'float-medium 6s ease-in-out infinite',
        'float-fast': 'float-fast 4s ease-in-out infinite',
        'pulse-pin': 'pulse-pin 2s ease-out infinite',
        'wave': 'wave 0.8s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
