/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import { ThemeContext, themes, UserContext } from "./context"

import { Header, Footer, ProtectedRoute } from "./components"
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
} from "./pages"

export default function App() {
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
	}

	const signOut = () => {
		setToken("")
		setUser({})
		localStorage.removeItem("token")
		localStorage.removeItem("user")
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
					<Header />
					<Routes>
						<Route
							path="*"
							element={<Error error={"Error 404: Page not found."} />}
						/>
						<Route exact path="/" element={<Home />} />
						<Route exact path="/reddit" element={<HomeReddit />} />
						<Route exact path="/become-editor" element={<BecomeEditor />} />
						<Route exact path="/sign-up" element={<SignUp />} />
						<Route exact path="/sign-in" element={<SignIn signIn={signIn} />} />

						<Route
							exact
							path="/news/:newsId"
							element={
								<ProtectedRoute>
									<News />
								</ProtectedRoute>
							}
						/>
						<Route
							exact
							path="/profile"
							element={
								<ProtectedRoute>
									<Profile />
								</ProtectedRoute>
							}
						/>

						<Route
							exact
							path="/profile/:authorId"
							element={
								<ProtectedRoute>
									<Profile />
								</ProtectedRoute>
							}
						/>

						<Route
							exact
							path="/create"
							element={
								<ProtectedRoute authorOnly={true}>
									<CreateNews />
								</ProtectedRoute>
							}
						/>

						<Route exact path="/news/:newsId/edit" element={<EditNews />} />
					</Routes>
					<Footer />
				</Router>
			</UserContext.Provider>
		</ThemeContext.Provider>
	)
}
