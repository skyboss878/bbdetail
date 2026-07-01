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
        obsidian:    '#0A0A0B',
        carbon:      '#141416',
        graphite:    '#1E1E22',
        steel:       '#2C2C32',
        chrome:      '#C8C8CC',
        silver:      '#E8E8EC',
        gold:        '#C9A84C',
        'gold-light':'#E2C97E',
        amber:       '#F5A623',
      },
    },
  },
  plugins: [],
  safelist: [
    'bg-obsidian','bg-carbon','bg-graphite','bg-steel',
    'text-obsidian','text-carbon','text-graphite',
    'text-chrome','text-silver','text-gold','text-amber',
    'border-steel','border-gold','border-chrome',
    'bg-gold','bg-gold-light','hover:bg-gold','hover:bg-gold-light',
    'ring-gold',{ pattern: /bg-(obsidian|carbon|graphite|steel|gold)\/\d+/ },
    { pattern: /text-(chrome|silver|gold|amber)\/\d+/ },
    { pattern: /border-(steel|gold|chrome)\/\d+/ },
  ],
}
