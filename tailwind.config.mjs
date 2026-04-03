/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/blocks/**/*.{js,ts,jsx,tsx}',
    './src/heros/**/*.{js,ts,jsx,tsx}',
    './src/Footer/**/*.{js,ts,jsx,tsx}',
    './src/Header/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        dex: {
          bg: '#1C1B18',
          surface: '#2c2c2a',
          primary: '#1D9E75',
          accent: '#FF5C00',
          text: '#ffffff',
          muted: '#a0a09a',
          border: '#3a3a38',
        },
      },
      fontFamily: {
        display: ['var(--font-play)', 'sans-serif'],
        body: ['var(--font-dm-sans)', 'sans-serif'],
      },
      typography: () => ({
        DEFAULT: {
          css: [
            {
              '--tw-prose-body': 'var(--text)',
              '--tw-prose-headings': 'var(--text)',
              h1: {
                fontWeight: 'normal',
                marginBottom: '0.25em',
              },
            },
          ],
        },
        base: {
          css: [
            {
              h1: {
                fontSize: '2.5rem',
              },
              h2: {
                fontSize: '1.25rem',
                fontWeight: 600,
              },
            },
          ],
        },
        md: {
          css: [
            {
              h1: {
                fontSize: '3.5rem',
              },
              h2: {
                fontSize: '1.5rem',
              },
            },
          ],
        },
      }),
    },
  },
}

export default config
