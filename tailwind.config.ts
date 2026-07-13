import type { Config } from "tailwindcss";

// Vort Brand Design Language v1.0 -> Tailwind theme.
// Colors reference CSS variables defined in app/globals.css so a dark-mode
// swap can be added later without touching component classes.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--primary)",
          dark: "var(--primary-dark)",
          light: "var(--primary-light)",
        },
        bg: "var(--bg)",
        surface: {
          DEFAULT: "var(--surface)",
          alt: "var(--surface-alt)",
          muted: "var(--surface-muted)",
        },
        fg: {
          DEFAULT: "var(--fg)",
          secondary: "var(--fg-secondary)",
          muted: "var(--fg-muted)",
          placeholder: "var(--fg-placeholder)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        success: "var(--success)",
        warning: "var(--warning)",
        destructive: "var(--destructive)",
      },
      fontFamily: {
        body: "var(--font-body)",
        heading: "var(--font-heading)",
        mono: "var(--font-mono)",
      },
      fontSize: {
        xs: ["11px", { lineHeight: "1.4" }],
        sm: ["13px", { lineHeight: "1.5" }],
        base: ["15px", { lineHeight: "1.6" }],
        md: ["17px", { lineHeight: "1.5" }],
        lg: ["22px", { lineHeight: "1.4" }],
        xl: ["28px", { lineHeight: "1.3" }],
        "2xl": ["36px", { lineHeight: "1.2" }],
        "3xl": ["48px", { lineHeight: "1.1" }],
        "4xl": ["64px", { lineHeight: "1.05" }],
        "5xl": ["88px", { lineHeight: "1.0" }],
      },
      borderRadius: {
        sm: "8px",
        md: "10px",
        lg: "12px",
        full: "9999px",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(0,0,0,0.05)",
        md: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)",
        lg: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      transitionDuration: {
        fast: "150ms",
        normal: "250ms",
        slow: "400ms",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-in": "fade-in 250ms cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
