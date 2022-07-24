import React from "react"

export const themes = {
	dark: {
		text: "#fff",
		secondText: "gray",
		compBackground: "#151515", // used for background of different components
		compBackground2: "#0f0f0f", // used for a darker bg of different components
		pageBackground: "#050505", // used for the background of the page
		border: "#303030",
		primary: "lightseagreen",
		shadow: "black",
	},
	light: {
		text: "#161616",
		secondText: "#434343",
		compBackground: "#ffffff", // used for background of different components
		compBackground2: "#f0f0f0", // used for a darker bg of different components
		pageBackground: "#d4d4d4", // used for the background of the page
		border: "#a0a0a0",
		primary: "lightseagreen",
		shadow: "#161616",
	},
}

export const ThemeContext = React.createContext({
	theme: themes.dark,
	toggleTheme: () => {},
})
