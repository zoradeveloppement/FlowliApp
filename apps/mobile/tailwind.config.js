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
        // Flowli Charter Colors
        primary: "#7C3AED",
        primaryLight: "#A78BFA",
        primaryGlow: "#DDD6FE",
        primaryForeground: "#FFFFFF",
        
        // Light mode
        background: "#FFFFFF",
        foreground: "#181C25",
        card: "#FFFFFF",
        muted: "#F4F5F6",
        mutedForeground: "#6B7280",
        border: "#E5E7EB",
        input: "#E5E7EB",
        
        // Dark mode variants (referenced in ThemeProvider)
        backgroundDark: "#181C25",
        foregroundDark: "#FFFFFF",
        cardDark: "#181C25",
        mutedDark: "#23272F",
        mutedForegroundDark: "#9CA3AF",
        borderDark: "#23272F",
        inputDark: "#23272F",
        
        // Semantic colors
        destructive: "#F87171",
        destructiveDark: "#DC2626",
        success: "#25D366",
        ring: "#7C3AED",
      },
      borderRadius: {
        none: "0",
        sm: "4px",
        md: "6px",
        lg: "8px",
        xl: "12px",
        "2xl": "16px",
        "3xl": "24px",
        full: "9999px",
      },
      fontFamily: {
        primary: ['ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      fontSize: {
        xs: '12px',
        sm: '14px',
        md: '16px',
        lg: '20px',
        xl: '24px',
        h3: '24px',
        h2: '36px',
        h1: '60px',
        heroMobile: '24px',
      },
      spacing: {
        0: '0',
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        6: '24px',
        8: '32px',
        12: '48px',
        16: '64px',
        20: '80px',
        24: '96px',
        32: '128px',
      },
      boxShadow: {
        card: '0 4px 6px -1px rgba(229, 231, 235, 0.1), 0 2px 4px -1px rgba(229, 231, 235, 0.06)',
        primary: '0 10px 30px -10px rgba(124, 58, 237, 0.3)',
        hover: '0 20px 40px -12px rgba(124, 58, 237, 0.25)',
        premium: '0 8px 25px -5px rgba(124, 58, 237, 0.15), 0 0 0 1px rgba(124, 58, 237, 0.05)',
        premiumHover: '0 15px 35px -8px rgba(124, 58, 237, 0.25), 0 0 0 1px rgba(124, 58, 237, 0.1)',
      },
      keyframes: {
        ping: {
          '75%, 100%': { transform: 'scale(2)', opacity: '0' },
        },
        fadeInDelayed: {
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        ping: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
        fadeInDelayed: 'fadeInDelayed 0.6s ease-out 0.8s forwards',
        scroll: 'scroll 40s linear infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
