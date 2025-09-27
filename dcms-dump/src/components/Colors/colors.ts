import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // adjust for your project
  ],
  theme: {
    extend: {
      colors: {
        Custom_Pink: {
          50: '#ffe4ec',
          100: '#ffccd9',
          200: '#ffb3c6',
          300: '#ff99b3',
          400: '#ff80a0',
          500: '#ff4d79',
          600: '#e63e6b',
          700: '#cc2e5c',
          800: '#b31f4e',
          900: '#990f40',
        },
        accent: {
          100: '#fff1f6',
          200: '#ffd6e0',
          300: '#ffadc4',
        },
        neutral: {
          50: '#ffffff',
          100: '#fafafa',
          200: '#f5f5f5',
          700: '#555555',
          900: '#222222',
        },
        success: '#22c55e',
        error: '#ef4444',
      },
    },
  },
  plugins: [],
}

export default config
