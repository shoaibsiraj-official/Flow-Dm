/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        "./src/app/**/*.{js,jsx,ts,tsx}",
        "./src/components/**/*.{js,jsx,ts,tsx}",
        "./src/lib/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
            },
            colors: {
                background: "#09090B",
                surface: {
                    DEFAULT: "#111827",
                    raised: "#161E2E",
                    sunken: "#0D0F14",
                },
                border: {
                    DEFAULT: "#27272A",
                    subtle: "#1F1F23",
                },
                primary: {
                    DEFAULT: "#6366F1",
                    hover: "#5457E5",
                    foreground: "#F9FAFB",
                    50: "#EEF0FF",
                    400: "#818CF8",
                    500: "#6366F1",
                    600: "#4F52D6",
                },
                success: { DEFAULT: "#22C55E", foreground: "#052E14" },
                danger: { DEFAULT: "#EF4444", foreground: "#450A0A" },
                warning: { DEFAULT: "#F59E0B", foreground: "#451A03" },
                foreground: "#F9FAFB",
                muted: "#9CA3AF",
                "muted-foreground": "#6B7280",
            },
            borderRadius: {
                xl: "0.875rem",
                "2xl": "1.25rem",
                "3xl": "1.75rem",
            },
            boxShadow: {
                soft: "0 1px 2px 0 rgba(0,0,0,0.35), 0 8px 24px -8px rgba(0,0,0,0.45)",
                glow: "0 0 0 1px rgba(99,102,241,0.15), 0 8px 40px -8px rgba(99,102,241,0.35)",
                "inner-border": "inset 0 0 0 1px rgba(255,255,255,0.06)",
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(circle at center, var(--tw-gradient-stops))",
                "grid-pattern":
                    "linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)",
            },
            keyframes: {
                "fade-in": { from: { opacity: 0 }, to: { opacity: 1 } },
                "fade-up": {
                    from: { opacity: 0, transform: "translateY(8px)" },
                    to: { opacity: 1, transform: "translateY(0)" },
                },
                "scale-in": {
                    from: { opacity: 0, transform: "scale(0.96)" },
                    to: { opacity: 1, transform: "scale(1)" },
                },
                float: {
                    "0%,100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-6px)" },
                },
                shimmer: {
                    "0%": { backgroundPosition: "-700px 0" },
                    "100%": { backgroundPosition: "700px 0" },
                },
            },
            animation: {
                "fade-in": "fade-in 0.4s ease-out",
                "fade-up": "fade-up 0.5s ease-out",
                "scale-in": "scale-in 0.3s ease-out",
                float: "float 6s ease-in-out infinite",
                shimmer: "shimmer 1.6s linear infinite",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};
