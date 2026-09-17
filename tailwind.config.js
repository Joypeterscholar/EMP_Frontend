/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"],
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				sans: ['"Inter"', "system-ui", "-apple-system", "sans-serif"],
			},
			borderRadius: {
				"2xl": "1rem",
				"3xl": "1.5rem",
				"4xl": "2rem",
			},
			colors: {
				brand: {
					50: "#f0f4ff",
					100: "#dbe4ff",
					200: "#bac8ff",
					300: "#91a7ff",
					400: "#748ffc",
					500: "#5c7cfa",
					600: "#4c6ef5",
					700: "#4263eb",
					800: "#3b5bdb",
					900: "#364fc7",
					950: "#1e3a8a",
				},
				surface: {
					0: "#ffffff",
					50: "#f8f9fc",
					100: "#f1f3f9",
					200: "#e2e6f0",
					300: "#d1d5e4",
					400: "#9ca3af",
					500: "#6b7280",
					600: "#4b5563",
					700: "#374151",
					800: "#1f2937",
					900: "#111827",
				},
				accent: {
					emerald: "#10b981",
					amber: "#f59e0b",
					rose: "#f43f5e",
					violet: "#8b5cf6",
					cyan: "#06b6d4",
				},
			},
			boxShadow: {
				"glow-sm": "0 0 15px -3px rgba(92, 124, 250, 0.15)",
				"glow-md": "0 0 25px -5px rgba(92, 124, 250, 0.2)",
				"glow-lg": "0 0 40px -10px rgba(92, 124, 250, 0.25)",
				"inner-glow": "inset 0 1px 0 0 rgba(255, 255, 255, 0.05)",
				"soft-xl":
					"0 4px 20px -2px rgba(0, 0, 0, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.04)",
				"soft-2xl":
					"0 8px 30px -4px rgba(0, 0, 0, 0.08), 0 4px 8px -4px rgba(0, 0, 0, 0.04)",
				"elevated":
					"0 12px 40px -8px rgba(0, 0, 0, 0.12), 0 4px 12px -4px rgba(0, 0, 0, 0.06)",
			},
			animation: {
				"fade-in": "fadeIn 0.3s ease-out",
				"slide-up": "slideUp 0.3s ease-out",
				"slide-down": "slideDown 0.3s ease-out",
				"scale-in": "scaleIn 0.2s ease-out",
				"border-shine": "border-shine 4s linear infinite",
			},
			keyframes: {
				fadeIn: {
					"0%": { opacity: "0" },
					"100%": { opacity: "1" },
				},
				slideUp: {
					"0%": { opacity: "0", transform: "translateY(10px)" },
					"100%": { opacity: "1", transform: "translateY(0)" },
				},
				slideDown: {
					"0%": { opacity: "0", transform: "translateY(-10px)" },
					"100%": { opacity: "1", transform: "translateY(0)" },
				},
				scaleIn: {
					"0%": { opacity: "0", transform: "scale(0.95)" },
					"100%": { opacity: "1", transform: "scale(1)" },
				},
				"border-shine": {
					"0%": { backgroundPosition: "200% 0" },
					"100%": { backgroundPosition: "-200% 0" },
				},
			},
		},
	},
	plugins: [
		require("@tailwindcss/typography"),
		require("tailwindcss-animate"),
	],
};
