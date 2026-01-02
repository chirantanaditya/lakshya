/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f5ff',
          100: '#b3e0ff',
          200: '#80ccff',
          300: '#4db8ff',
          400: '#1aa3ff',
          500: '#0a98e5', // Main primary blue
          600: '#016295', // Darker blue
          700: '#013a59', // Dark blue background
          800: '#002d47',
          900: '#001f35',
        },
        secondary: {
          // Will be updated when we get exact values from Webflow
          DEFAULT: '#41b937', // Green accent
        },
        accent: {
          red: '#f82c2d',
          orange: '#e2814b',
          yellow: '#e2a64b',
          green: '#41b937',
          teal: '#0baa97',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Webflow Client-First text sizes
        'xxlarge': ['4rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }], // 64px
        'xlarge': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }], // 48px
        'large': ['2rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }], // 32px
        'medium': ['1.5rem', { lineHeight: '1.4' }], // 24px
        'small': ['1.25rem', { lineHeight: '1.5' }], // 20px
        'xsmall': ['1.125rem', { lineHeight: '1.5' }], // 18px
      },
      fontWeight: {
        xbold: '900',
        bold: '700',
        semibold: '600',
        medium: '500',
        normal: '400',
        light: '300',
      },
      borderRadius: {
        '4xl': '48px',
      },
    },
  },
  plugins: [],
}

