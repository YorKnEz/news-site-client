import React from "react"

export const themes = {
	dark: {
		bold: "#f2f2f2",
		text: "#dedede",
		disabled: "#999999",

		compBg: "#1c1c1c", // used for background of different components
		compBgDark: "#171717", // used for a darker bg of different components
		compBgLight: "#212121", // used for a lighter bg of different components
		pageBg: "#121212", // used for the background of the page

		border: "#303030",
		primary: "#00c3ff",
		complementary: "#ff3b00", // primary complementary

		// primary button
		buttonP: "#dedede",
		buttonHoverP: "#dadada",
		buttonTextP: "#161616",

		// secondary button
		buttonS: "#dedede00",
		buttonHoverS: "#dedede10",
		buttonTextS: "#dedede",

		link: "#00c3ffaa",
		linkBg: "#00c3ff20",
		linkHover: "#6fd4ffaa",
		linkHoverBg: "#6fd4ff20",
	},
	light: {
		bold: "#161616",
		text: "#161616",
		disabled: "#434343",

		compBg: "#ffffff", // used for background of different components
		compBgDark: "#eeeeee", // used for a darker bg of different components
		compBgLight: "#dddddd", // used for a lighter bg of different components
		pageBg: "#d4d4d4", // used for the background of the page

		border: "#a0a0a0",
		primary: "#00d5ff",
		complementary: "#B00020",

		// primary button
		buttonP: "#00d5ff",
		buttonHoverP: "#00c0e6",
		buttonTextP: "white",

		// secondary button
		buttonS: "#00000000",
		buttonHoverS: "#00000010",
		buttonTextS: "#00d5ff",

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
