/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
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
			screens: {
				xs: "480px",
				"2xs": "360px",
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
