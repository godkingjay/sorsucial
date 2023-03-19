/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			boxShadow: {
				"around-sm": "0 0 2px 1px #0001",
				"around-lg": "0 0 16px 0 #0001",
				"around-xl": "0 0 24px 0 #0002",
				"page-box-1": "0 1px 1px 1px #0002",
			},
			colors: {
				"logo-100": "#ff4040",
				"logo-200": "#f00000",
				"logo-300": "#c00000",
				"logo-400": "#a00000",
				"logo-500": "#800000",
				"logo-600": "#600000",
				"logo-700": "#400000",
				"logo-800": "#200000",
				"logo-900": "#100000",
			},
			fontSize: {
				"2xs": "0.625rem",
				"3xs": "0.5rem",
			},
			maxWidth: {
				"2xs": "256px",
			},
			screens: {
				"2xs": "360px",
				xs: "480px",
			},
			width: {
				"2xs": "256px",
				xs: "320px",
				sm: "384px",
				xl: "640px",
				"2xl": "764px",
			},
		},
	},
	plugins: [],
};
