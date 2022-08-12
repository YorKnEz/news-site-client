/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import { useApolloClient } from "@apollo/client"

import { PrivateRoutes } from "./components"
import { ThemeContext, themes, UserContext } from "./context"
import {
	Home,
	News,
	SignUp,
	SignIn,
	BecomeEditor,
	CreateNews,
	EditNews,
	Error,
	SearchResult,
	ForgotPassword,
	ResetPassword,
	VerifyEmail,
} from "./pages"
import {
	FollowedAuthors,
	LikedItems,
	News as Posts,
	Profile,
	SavedItems,
} from "./pages/profile"

export default function App() {
	const client = useApolloClient()
	const [theme, setTheme] = useState(
		themes[localStorage.getItem("theme")] || ""
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

	// set the theme according to the os theme
	useEffect(() => {
		// if theme has not been set
		if (theme === "") {
			// check if the os theme is dark
			if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
				// set the theme to dark
				setTheme(themes.dark)
				localStorage.setItem("theme", "dark")
				// else the os theme is probably light
			} else {
				// set the theme to light
				setTheme(themes.light)
				localStorage.setItem("theme", "light")
			}
		}
	}, [])

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

	const verifyEmail = userId => {
		// update the user object only if the user is logged in and the id of the verified user is the same as the currently logged in
		if (Object.keys(user).length > 0 && user.id === userId) {
			setUser({
				...user,
				verified: true,
			})
			localStorage.setItem("user", JSON.stringify({ ...user, verified: true }))
		}
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
					verifyEmail,
				}}
			>
				<Router>
					<Routes>
						{/* public routes */}
						<Route path="*" element={<Error code="404" />} />
						<Route exact path="/become-editor" element={<BecomeEditor />} />
						<Route exact path="/sign-up" element={<SignUp />} />
						<Route exact path="/sign-in" element={<SignIn />} />
						<Route exact path="/forgot-password" element={<ForgotPassword />} />
						<Route exact path="/reset-password" element={<ResetPassword />} />
						<Route
							exact
							path="/verify-email/:token"
							element={<VerifyEmail />}
						/>
						<Route exact path="/" element={<Home />} />
						<Route exact path="/news/:link-:newsId" element={<News />} />

						{/* private routes, accessible by all users */}
						<Route element={<PrivateRoutes />}>
							<Route
								exact
								path="/profile/:id/overview/"
								element={<Profile />}
							/>
							<Route exact path="/profile/:id/news/" element={<Posts />} />
							<Route
								exact
								path="/profile/:id/followed/"
								element={<FollowedAuthors />}
							/>
							<Route
								exact
								path="/profile/:id/liked/"
								element={<LikedItems />}
							/>
							<Route
								exact
								path="/profile/:id/saved/"
								element={<SavedItems />}
							/>

							<Route exact path="/search" element={<SearchResult />} />
						</Route>

						{/* private routes, accessible only by authors */}
						<Route element={<PrivateRoutes authorOnly />}>
							<Route exact path="/news/create" element={<CreateNews />} />
							<Route
								exact
								path="/news/:link-:newsId/edit"
								element={<EditNews />}
							/>
						</Route>
					</Routes>
				</Router>
			</UserContext.Provider>
		</ThemeContext.Provider>
	)
}
