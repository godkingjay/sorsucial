/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			boxShadow: {},
			colors: {
				"logo-500": "#800000",
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
			},
		},
	},
	plugins: [],
};
