import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#FAFAFA",
        ink: "#0A0A0A",
        mute: "#6B7280",
        rule: "#E5E5E5",
        accent: "#14B8A6",
        warn: "#F97316",
        code: "#F4F4F5",
        ph: {
          bg: "#FFF7ED",
          border: "#F97316",
          label: "#9A3412",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        body: ["18px", { lineHeight: "1.65" }],
      },
      maxWidth: {
        measure: "680px",
        breakout: "960px",
      },
    },
  },
  plugins: [],
};

export default config;
