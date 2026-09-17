/** @type {import('tailwindcss').Config} */
export default {
	darkMode: "class",
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
					50: "#eef2ff",
					100: "#e0e7ff",
					200: "#c7d2fe",
					300: "#a5b4fc",
					400: "#818cf8",
					500: "#6366f1",
					600: "#4f46e5",
					700: "#4338ca",
					800: "#3730a3",
					900: "#312e81",
					950: "#1e1b4b",
				},
				surface: {
					0: "#0a0a0f",
					50: "#0f1117",
					100: "#161822",
					200: "#1e2030",
					300: "#2a2d3e",
					400: "#3a3d50",
					500: "#646680",
					600: "#8b8da5",
					700: "#b0b2c5",
					800: "#d4d6e3",
					900: "#f0f1f7",
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
				"glow-sm": "0 0 15px -3px rgba(99, 102, 241, 0.2)",
				"glow-md": "0 0 25px -5px rgba(99, 102, 241, 0.25)",
				"glow-lg": "0 0 40px -10px rgba(99, 102, 241, 0.3)",
				"inner-glow": "inset 0 1px 0 0 rgba(255, 255, 255, 0.05)",
				"soft-xl":
					"0 4px 20px -2px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.2)",
				"soft-2xl":
					"0 8px 30px -4px rgba(0, 0, 0, 0.4), 0 4px 8px -4px rgba(0, 0, 0, 0.2)",
				"elevated":
					"0 12px 40px -8px rgba(0, 0, 0, 0.5), 0 4px 12px -4px rgba(0, 0, 0, 0.3)",
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
