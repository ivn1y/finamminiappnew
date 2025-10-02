import type { Config } from "tailwindcss";

const config = {
	// important: true,
	darkMode: ["class"],
	content: [
		"./src/**/*.{js,jsx,ts,tsx}",
		"./src/app/**/*.{js,jsx,ts,tsx}",
		"./src/components/**/*.{js,jsx,ts,tsx}",
		"./src/widgets/**/*.{js,jsx,ts,tsx}",
		"./src/features/**/*.{js,jsx,ts,tsx}",
		"./src/entities/**/*.{js,jsx,ts,tsx}",
		"./src/shared/**/*.{js,jsx,ts,tsx}",
		"./src/components/**/*.{js,jsx,ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px"
			}
		},
		extend: {
			fontFamily: {
				sans: ["var(--font-inter)", "Inter", "sans-serif"],
				'inter-tight': ["var(--font-inter-tight)", "Inter Tight", "sans-serif"],
				mono: ["var(--font-inter)", "Inter", "monospace"],
			},
			colors: {
				border: "oklch(var(--border))",
				input: "oklch(var(--input))",
				ring: "oklch(var(--ring))",
				background: "oklch(var(--background))",
				foreground: "oklch(var(--foreground))",
				primary: {
					DEFAULT: "oklch(var(--primary))",
					foreground: "oklch(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "oklch(var(--secondary))",
					foreground: "oklch(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "oklch(var(--destructive))",
					foreground: "oklch(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "oklch(var(--muted))",
					foreground: "oklch(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "oklch(var(--accent))",
					foreground: "oklch(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "oklch(var(--popover))",
					foreground: "oklch(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "oklch(var(--card))",
					foreground: "oklch(var(--card-foreground))",
				},
				chart: {
					'1': 'oklch(var(--chart-1))',
					'2': 'oklch(var(--chart-2))',
					'3': 'oklch(var(--chart-3))',
					'4': 'oklch(var(--chart-4))',
					'5': 'oklch(var(--chart-5))'
				},
				sidebar: {
					DEFAULT: 'oklch(var(--sidebar))',
					foreground: 'oklch(var(--sidebar-foreground))',
					primary: 'oklch(var(--sidebar-primary))',
					'primary-foreground': 'oklch(var(--sidebar-primary-foreground))',
					accent: 'oklch(var(--sidebar-accent))',
					'accent-foreground': 'oklch(var(--sidebar-accent-foreground))',
					border: 'oklch(var(--sidebar-border))',
					ring: 'oklch(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)"
			},
			keyframes: {
				glitch: {
					'0%': {
						'clip-path': 'inset(20% 0 50% 0)'
					},
					'5%': {
						'clip-path': 'inset(10% 0 60% 0)'
					},
					'10%': {
						'clip-path': 'inset(15% 0 55% 0)'
					},
					'15%': {
						'clip-path': 'inset(25% 0 35% 0)'
					},
					'20%': {
						'clip-path': 'inset(30% 0 40% 0)'
					},
					'25%': {
						'clip-path': 'inset(40% 0 20% 0)'
					},
					'30%': {
						'clip-path': 'inset(10% 0 60% 0)'
					},
					'35%': {
						'clip-path': 'inset(15% 0 55% 0)'
					},
					'40%': {
						'clip-path': 'inset(25% 0 35% 0)'
					},
					'45%': {
						'clip-path': 'inset(30% 0 40% 0)'
					},
					'50%': {
						'clip-path': 'inset(20% 0 50% 0)'
					},
					'55%': {
						'clip-path': 'inset(10% 0 60% 0)'
					},
					'60%': {
						'clip-path': 'inset(15% 0 55% 0)'
					},
					'65%': {
						'clip-path': 'inset(25% 0 35% 0)'
					},
					'70%': {
						'clip-path': 'inset(30% 0 40% 0)'
					},
					'75%': {
						'clip-path': 'inset(40% 0 20% 0)'
					},
					'80%': {
						'clip-path': 'inset(20% 0 50% 0)'
					},
					'85%': {
						'clip-path': 'inset(10% 0 60% 0)'
					},
					'90%': {
						'clip-path': 'inset(15% 0 55% 0)'
					},
					'95%': {
						'clip-path': 'inset(25% 0 35% 0)'
					},
					'100%': {
						'clip-path': 'inset(30% 0 40% 0)'
					}
				},
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'glitch-after': 'glitch var(--after-duration) infinite linear alternate-reverse',
				'glitch-before': 'glitch var(--before-duration) infinite linear alternate-reverse'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
