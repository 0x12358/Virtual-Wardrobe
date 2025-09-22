/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // 主背景色 - 纯净白色和极浅灰
        'pure-white': '#FFFFFF',
        'whisper-gray': '#FAFBFC',
        'cloud-white': '#F8FAFC',
        
        // 柔和渐变色系 - 淡紫色、粉色、蓝色
        'lavender': {
          50: '#F8F7FF',
          100: '#F0EDFF',
          200: '#E4DEFF',
          300: '#D1C4FF',
          400: '#B8A3FF',
          500: '#9B7EFF'
        },
        'rose': {
          50: '#FFF7F8',
          100: '#FFEBEF',
          200: '#FFD6E1',
          300: '#FFB8CC',
          400: '#FF8FAB',
          500: '#FF6B8A'
        },
        'sky': {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9'
        },
        
        // 中性色 - 更柔和的灰色系
        'neutral': {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717'
        }
      },
      fontFamily: {
        'sans': ['Inter', 'SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif']
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '38': '9.5rem'
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 30px -5px rgba(0, 0, 0, 0.05)',
        'large': '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 20px 50px -10px rgba(0, 0, 0, 0.1)',
        'glow-purple': '0 0 30px rgba(155, 126, 255, 0.3)',
        'glow-pink': '0 0 30px rgba(255, 107, 138, 0.3)',
        'glow-blue': '0 0 30px rgba(14, 165, 233, 0.3)'
      },
      backdropBlur: {
        'xs': '2px'
      },
      animation: {
        'pulse-soft': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 4s ease-in-out infinite alternate',
        'scale-hover': 'scale-hover 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        glow: {
          '0%': { opacity: '0.5' },
          '100%': { opacity: '1' }
        },
        'scale-hover': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.05)' }
        }
      }
    },
  },
  plugins: [],
}