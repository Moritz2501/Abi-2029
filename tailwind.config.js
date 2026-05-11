/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0a0f1e',
        'dark-secondary': '#0f1629',
        'dark-tertiary': '#141d2f',
        'accent-purple': '#2d0a4e',
        'accent-purple-light': '#4a1a7f',
        'accent-blue': '#1a3a52',
        'glass-white': 'rgba(255, 255, 255, 0.10)',
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '12px',
        'lg': '20px',
        'xl': '40px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-glow-purple': '0 0 30px 0 rgba(109, 40, 217, 0.3)',
        'glass-glow-blue': '0 0 30px 0 rgba(59, 130, 246, 0.3)',
        'glass-inner': 'inset 0 2px 8px 0 rgba(255, 255, 255, 0.15)',
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      backgroundImage: {
        'gradient-glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)',
        'gradient-purple-blue': 'linear-gradient(135deg, #2d0a4e 0%, #1a3a52 100%)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
