import React from "react"

/*
	OLD
	link: "#44b6eb",
	linkHover: "#75c9f0",
*/

export const themes = {
	dark: {
		text: "#fff",
		secondText: "gray",
		compBg: "#151515", // used for background of different components
		compBgDark: "#0f0f0f", // used for a darker bg of different components
		compBgLight: "#242424", // used for a lighter bg of different components
		pageBg: "#050505", // used for the background of the page
		border: "#303030",
		primary: "lightseagreen",
		shadow: "black",
		link: "rgb(27, 145, 204)",
		linkBg: "rgba(27, 145, 204, 0.3)",
		linkHover: "rgb(97, 188, 234)",
		linkHoverBg: "rgb(97, 188, 234, 0.3)",
	},
	light: {
		text: "#161616",
		secondText: "#434343",
		compBg: "#ffffff", // used for background of different components
		compBgDark: "#f0f0f0", // used for a darker bg of different components
		pageBg: "#d4d4d4", // used for the background of the page
		border: "#a0a0a0",
		primary: "lightseagreen",
		shadow: "#161616",
		link: "rgb(27, 145, 204)",
		linkBg: "rgba(27, 145, 204, 0.3)",
		linkHover: "rgb(97, 188, 234)",
		linkHoverBg: "rgb(97, 188, 234, 0.3)",
	},
}

export const ThemeContext = React.createContext({
	theme: themes.dark,
	toggleTheme: () => {},
})
