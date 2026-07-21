import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Graphite base surfaces
        graphite: {
          950: "#080a0e",
          900: "#0d1117",
          850: "#11161d",
          800: "#161b22",
          750: "#1a2029",
          700: "#1f2630",
          600: "#262d38",
          500: "#2f3945",
        },
        line: {
          DEFAULT: "#21262d",
          soft: "#1a2029",
          strong: "#30363d",
        },
        fg: {
          DEFAULT: "#e6edf3",
          muted: "#9aa4b2",
          faint: "#6e7681",
          dim: "#4d545e",
        },
        // Primary accent — molten amber
        amber: {
          DEFAULT: "#f59e0b",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
        },
        // Secondary accent — reactor cyan
        cyan: {
          DEFAULT: "#22d3ee",
          300: "#67e8f9",
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(245,158,11,0.15), 0 8px 40px -12px rgba(245,158,11,0.25)",
        "glow-cyan": "0 0 0 1px rgba(34,211,238,0.15), 0 8px 40px -12px rgba(34,211,238,0.25)",
        panel: "0 1px 0 0 rgba(255,255,255,0.03) inset, 0 20px 50px -24px rgba(0,0,0,0.7)",
        lift: "0 30px 60px -24px rgba(0,0,0,0.8)",
      },
      backgroundImage: {
        "grid-line":
          "linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)",
        "radial-fade":
          "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(245,158,11,0.10), transparent 70%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both",
        float: "float 7s ease-in-out infinite",
        marquee: "marquee 32s linear infinite",
        shimmer: "shimmer 2.5s linear infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
