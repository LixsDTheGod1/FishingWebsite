/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Outfit", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["DM Sans", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          50: 'oklch(0.97 0.02 200)',
          100: 'oklch(0.93 0.05 200)',
          200: 'oklch(0.85 0.08 200)',
          400: 'oklch(0.72 0.14 200)',
          500: 'oklch(0.62 0.16 200)',
          600: 'oklch(0.52 0.14 200)',
          700: 'oklch(0.42 0.11 200)',
          900: 'oklch(0.22 0.06 220)',
        },
        surface: {
          800: 'oklch(0.2 0.03 250)',
          900: 'oklch(0.14 0.02 250)',
        }
      },
    },
  },
  plugins: [],
}
