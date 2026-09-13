/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0b1120",
        card: "rgba(17, 25, 40, 0.75)",
        border: "rgba(255, 255, 255, 0.08)",
        primary: {
          DEFAULT: "#10b981",
          foreground: "#ffffff",
        },
        gold: {
          DEFAULT: "#f59e0b",
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#06b6d4",
          foreground: "#ffffff",
        },
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#94a3b8",
          foreground: "#64748b",
        }
      },
    },
  },
  plugins: [],
}
