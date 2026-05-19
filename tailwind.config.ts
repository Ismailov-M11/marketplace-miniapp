import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        tg: {
          bg: "var(--tg-bg)",
          text: "var(--tg-text)",
          hint: "var(--tg-hint)",
          link: "var(--tg-link)",
          button: "var(--tg-button)",
          "button-text": "var(--tg-button-text)",
          secondary: "var(--tg-secondary-bg)",
          header: "var(--tg-header-bg)",
          accent: "var(--tg-accent-text)",
          section: "var(--tg-section-bg)",
          "section-header": "var(--tg-section-header-text)",
          subtitle: "var(--tg-subtitle-text)",
          destructive: "var(--tg-destructive-text)",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
