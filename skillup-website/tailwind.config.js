/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E90FF',
          50: '#F0F8FF',
          100: '#E6F3FF',
          500: '#1E90FF',
          600: '#1976D2',
          700: '#1565C0',
        },
        secondary: {
          DEFAULT: '#F0F8FF',
          50: '#F0F8FF',
          100: '#E6F3FF',
        },
      },
      fontFamily: {
        sans: ['system-ui', 'sans-serif'],
      },
      borderRadius: {
        'default': '8px',
      },
      boxShadow: {
        'default': '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
