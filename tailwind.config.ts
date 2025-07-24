import type { Config } from "tailwindcss"

// This configuration is for Tailwind v4 compatibility
// The actual configuration is now done in globals.css using @theme directive

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // Theme configuration is now handled in globals.css via @theme directive
    // This section is kept for reference and legacy compatibility
    extend: {
      fontFamily: {
        sans: ['Poppins', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['Fira Code', 'Monaco', 'Cascadia Code', 'Segoe UI Mono', 'monospace'],
      },
      colors: {
        // Custom colors defined in globals.css
        primary: "#4ADE80", // Green from palette
        secondary: "#14B8A6", // Teal from palette
        tertiary: "#FDE047", // Yellow from palette
        surface: "#FFFBEB", // Light cream from palette
        text: "#1F2937", // Dark text from palette
        "text-muted": "#6B7280",
      },
    },
  },
  plugins: [],
}

export default config