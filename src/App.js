/* eslint-disable react-hooks/exhaustive-deps */
import { useApolloClient } from "@apollo/client"
import React, { useEffect, useState } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import { PrivateRoutes } from "./components"
import { ThemeContext, themes, UserContext } from "./context"
import {
	Home,
	HomeReddit,
	News,
	SignUp,
	SignIn,
	Profile,
	BecomeEditor,
	CreateNews,
	EditNews,
	Error,
	SearchResult,
	ForgotPassword,
	ResetPassword,
} from "./pages"

export default function App() {
	const client = useApolloClient()
	const [theme, setTheme] = useState(
		themes[localStorage.getItem("theme") || "light"]
	)
	const [token, setToken] = useState(localStorage.getItem("token") || "")
	const [user, setUser] = useState(
		JSON.parse(localStorage.getItem("user")) || {}
	)

	// https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
	let vh = window.innerHeight * 0.01
	document.documentElement.style.setProperty("--vh", `${vh}px`)
	window.addEventListener("resize", () => {
		let vh = window.innerHeight * 0.01
		document.documentElement.style.setProperty("--vh", `${vh}px`)
	})

	// set a property for each color in the theme object
	useEffect(() => {
		for (const color in theme) {
			// example:
			// for entry "text: "#fff"", the property name will be "--text-color"
			document.documentElement.style.setProperty(
				`--${color}-color`,
				`${theme[color]}`
			)
		}
	}, [theme])

	const toggleTheme = () => {
		if (theme === themes.light) {
			setTheme(themes.dark)
			localStorage.setItem("theme", "dark")
		} else {
			setTheme(themes.light)
			localStorage.setItem("theme", "light")
		}
	}

	const signIn = ({ token, user }) => {
		setToken(token)
		setUser(user)
		localStorage.setItem("token", token)
		localStorage.setItem("user", JSON.stringify(user))

		// reset apollo client token
		client.link.options.headers.authorization = token
	}

	const signOut = () => {
		setToken("")
		setUser({})
		localStorage.removeItem("token")
		localStorage.removeItem("user")

		// reset apollo client token
		client.link.options.headers.authorization = ""
	}

	return (
		<ThemeContext.Provider
			value={{
				theme,
				toggleTheme,
			}}
		>
			<UserContext.Provider
				value={{
					token,
					user,
					signIn,
					signOut,
				}}
			>
				<Router>
					<Routes>
						{/* public routes */}
						<Route path="*" element={<Error />} />
						<Route exact path="/become-editor" element={<BecomeEditor />} />
						<Route exact path="/sign-up" element={<SignUp />} />
						<Route exact path="/sign-in" element={<SignIn />} />
						<Route exact path="/forgot-password" element={<ForgotPassword />} />
						<Route exact path="/reset-password" element={<ResetPassword />} />
						<Route exact path="/" element={<Home />} />
						<Route exact path="/reddit" element={<HomeReddit />} />
						<Route exact path="/news/:newsId" element={<News />} />

						{/* private routes, accessible by all users */}
						<Route element={<PrivateRoutes />}>
							<Route exact path="/profile" element={<Profile />} />
							<Route exact path="/profile/:authorId" element={<Profile />} />
							<Route exact path="/search" element={<SearchResult />} />
						</Route>

						{/* private routes, accessible only by authors */}
						<Route element={<PrivateRoutes authorOnly />}>
							<Route exact path="/create" element={<CreateNews />} />
							<Route exact path="/news/:newsId/edit" element={<EditNews />} />
						</Route>
					</Routes>
				</Router>
			</UserContext.Provider>
		</ThemeContext.Provider>
	)
}
