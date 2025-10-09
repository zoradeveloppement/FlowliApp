/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './apps/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: "#6C63FF",
        primaryLight: "#B3B0FF",
        bgLight: "#FFFFFF",
        bgGray: "#F7F8FA",
        textMain: "#1A1A1A",
        textMuted: "#6E6E6E",
        success: "#4CAF50",
        warn: "#FF9800",
        danger: "#F44336",
        // Additional Flowli colors from globalStyles
        white: "#FFFFFF",
        black: "#000000",
        gray: {
          100: "#F7F8FA",
          200: "#E0E0E0",
          300: "#BDBDBD",
          400: "#9E9E9E",
          500: "#6E6E6E",
          600: "#424242",
          700: "#1A1A1A",
        },
      },
      borderRadius: { 
        xl: "16px",
        lg: "12px",
        md: "8px",
        sm: "4px",
        full: "9999px"
      },
      fontFamily: {
        'inter': ['Inter', 'system-ui', 'sans-serif'],
        'poppins': ['Poppins', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'h1': ['24px', { lineHeight: '36px', fontWeight: '600' }],
        'h2': ['20px', { lineHeight: '30px', fontWeight: '500' }],
        'body': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'secondary': ['14px', { lineHeight: '21px', fontWeight: '400' }],
        'button': ['15px', { lineHeight: '22px', fontWeight: '500' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        // Flowli spacing system
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        'xxl': '48px',
      },
      boxShadow: {
        'card': '0 2px 6px rgba(0,0,0,0.05)',
        'button': '0 2px 4px rgba(108, 99, 255, 0.2)',
        'sm': '0 1px 2px rgba(0,0,0,0.05)',
        'md': '0 4px 6px rgba(0,0,0,0.1)',
        'lg': '0 10px 15px rgba(0,0,0,0.1)',
      }
    },
  },
  plugins: [],
};
