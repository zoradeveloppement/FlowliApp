/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
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
      },
      borderRadius: { 
        xl: "16px",
        lg: "12px",
        md: "8px"
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
      },
      boxShadow: {
        'card': '0 2px 6px rgba(0,0,0,0.05)',
        'button': '0 2px 4px rgba(108, 99, 255, 0.2)',
      }
    },
  },
  plugins: [],
};
