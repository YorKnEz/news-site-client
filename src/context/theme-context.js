import React from "react"

export const themes = {
	dark: {
		text: "#fff",
		secondText: "gray",
		background: "#161616",
		button: "#lightseagreen",
		shadow: "black",
	},
	light: {
		text: "#161616",
		secondText: "#434343",
		background: "#fff",
		button: "lightseagreen",
		shadow: "#161616",
	},
}

export const ThemeContext = React.createContext({
	theme: themes.dark,
	toggleTheme: () => {},
})
