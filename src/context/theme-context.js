import React from "react"

export const themes = {
	dark: {
		text: "#eee",
		disabled: "#616161",

		compBg: "#151515", // used for background of different components
		compBgDark: "#0f0f0f", // used for a darker bg of different components
		compBgLight: "#242424", // used for a lighter bg of different components
		pageBg: "#050505", // used for the background of the page

		border: "#303030",
		primary: "#00d5ff",

		// primary button
		buttonP: "white",
		buttonHoverP: "#ddd",
		buttonTextP: "#161616",

		// secondary button
		buttonS: "#eeeeee00",
		buttonHoverS: "#eeeeee10",
		buttonTextS: "#eeeeee",

		error: "#CF6679",

		link: "rgb(27, 145, 204)",
		linkBg: "rgba(27, 145, 204, 0.3)",
		linkHover: "rgb(97, 188, 234)",
		linkHoverBg: "rgb(97, 188, 234, 0.3)",
	},
	light: {
		text: "#161616",
		disabled: "#434343",

		compBg: "#ffffff", // used for background of different components
		compBgDark: "#eeeeee", // used for a darker bg of different components
		compBgLight: "#dddddd", // used for a lighter bg of different components
		pageBg: "#d4d4d4", // used for the background of the page

		border: "#a0a0a0",
		primary: "#00d5ff",

		// primary button
		buttonP: "#00d5ff",
		buttonHoverP: "#00c0e6",
		buttonTextP: "white",

		// secondary button
		buttonS: "#00000000",
		buttonHoverS: "#00000010",
		buttonTextS: "#00d5ff",

		error: "red",

		link: "rgb(27, 145, 204)",
		linkBg: "rgba(27, 145, 204, 0.3)",
		linkHover: "rgb(97, 188, 234)",
		linkHoverBg: "rgb(97, 188, 234, 0.3)",
	},
}

export const ThemeContext = React.createContext({
	theme: themes.light,
	toggleTheme: () => {},
})
