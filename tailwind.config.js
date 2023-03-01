/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			boxShadow: {},
			colors: {},
			screens: {
				xs: "480px",
				"2xs": "360px",
			},
			fontSize: {
				"2xs": "0.625rem",
				"3xs": "0.5rem",
			},
		},
	},
	plugins: [],
};
