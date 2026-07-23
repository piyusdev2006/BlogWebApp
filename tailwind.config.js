/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Brand & Accent
        primary: {
          DEFAULT: "#5e6ad2",
          hover: "#828fff",
          focus: "#5e69d1",
        },
        "on-primary": "#ffffff",
        "brand-secure": "#7a7fad",

        // Surface ladder
        canvas: "#010102",
        "surface-1": "#0f1011",
        "surface-2": "#141516",
        "surface-3": "#18191a",
        "surface-4": "#191a1b",

        // Borders
        hairline: {
          DEFAULT: "#23252a",
          strong: "#34343a",
          tertiary: "#3e3e44",
        },

        // Text
        ink: {
          DEFAULT: "#f7f8f8",
          muted: "#d0d6e0",
          subtle: "#8a8f98",
          tertiary: "#62666d",
        },

        // Inverse
        "inverse-canvas": "#ffffff",
        "inverse-surface-1": "#f5f6f6",
        "inverse-surface-2": "#f6f7f7",
        "inverse-ink": "#000000",

        // Semantic
        "semantic-success": "#27a644",
        "semantic-overlay": "#000000",
      },
      fontFamily: {
        display: ["Inter", "SF Pro Display", "-apple-system", "system-ui", "Segoe UI", "Roboto", "sans-serif"],
        body: ["Inter", "SF Pro Display", "-apple-system", "system-ui", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SF Mono", "Menlo", "monospace"],
      },
      fontSize: {
        "display-xl": ["80px", { lineHeight: "1.05", letterSpacing: "-3.0px", fontWeight: "600" }],
        "display-lg": ["56px", { lineHeight: "1.10", letterSpacing: "-1.8px", fontWeight: "600" }],
        "display-md": ["40px", { lineHeight: "1.15", letterSpacing: "-1.0px", fontWeight: "600" }],
        "headline": ["28px", { lineHeight: "1.20", letterSpacing: "-0.6px", fontWeight: "600" }],
        "card-title": ["22px", { lineHeight: "1.25", letterSpacing: "-0.4px", fontWeight: "500" }],
        "subhead": ["20px", { lineHeight: "1.40", letterSpacing: "-0.2px", fontWeight: "400" }],
        "body-lg": ["18px", { lineHeight: "1.50", letterSpacing: "-0.1px", fontWeight: "400" }],
        "body": ["16px", { lineHeight: "1.50", letterSpacing: "-0.05px", fontWeight: "400" }],
        "body-sm": ["14px", { lineHeight: "1.50", letterSpacing: "0", fontWeight: "400" }],
        "caption": ["12px", { lineHeight: "1.40", letterSpacing: "0", fontWeight: "400" }],
        "button": ["14px", { lineHeight: "1.20", letterSpacing: "0", fontWeight: "500" }],
        "eyebrow": ["13px", { lineHeight: "1.30", letterSpacing: "0.4px", fontWeight: "500" }],
      },
      spacing: {
        "xxs": "4px",
        "xs": "8px",
        "sm-space": "12px",
        "md-space": "16px",
        "lg-space": "24px",
        "xl-space": "32px",
        "xxl": "48px",
        "section": "96px",
      },
      borderRadius: {
        "xs": "4px",
        "sm": "6px",
        "md": "8px",
        "lg": "12px",
        "xl": "16px",
        "xxl": "24px",
        "pill": "9999px",
      },
      boxShadow: {
        "focus-ring": "0 0 0 2px rgba(94, 106, 210, 0.5)",
        "card-hover": "0 0 0 1px #34343a",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "fade-in-up": "fadeInUp 0.6s ease-out forwards",
        "spin-slow": "spin 1.5s linear infinite",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
      maxWidth: {
        "content": "1280px",
      },
    },
  },
  plugins: [],
};
