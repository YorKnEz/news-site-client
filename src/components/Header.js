import React, { useContext, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AiOutlineMenu } from "react-icons/ai"
import { FcReddit } from "react-icons/fc"
import axios from "axios"

import "./Header.scss"
import { ThemeContext, UserContext } from "../context"
import Switch from "./Switch"

const ip = process.env.REACT_APP_EXPRESS_API_IP

function Header() {
	const { user, token, signOut } = useContext(UserContext)
	const { theme, toggleTheme } = useContext(ThemeContext)
	const [showDropdown, setShowDropdown] = useState(false)
	const [switchState, setSwitchState] = useState(
		theme === "dark" ? true : false
	)

	const history = useNavigate()

	useEffect(() => {
		const handleThemeToggle = () => {
			const switchElement = document.querySelector("#switchElement")

			if (!switchElement) return

			switchState
				? (switchElement.style.left = "calc(36px - 16px)")
				: (switchElement.style.left = "0")
		}

		handleThemeToggle()
	}, [switchState])

	const handleClick = e => {
		e.preventDefault()

		const dropdown = document.querySelector(".dropdown")

		setShowDropdown(!showDropdown)

		dropdown.style.top = !showDropdown ? "58px" : "-1000px"
	}

	const handleBlur = e => {
		const dropdown = document.querySelector(".dropdown")

		setShowDropdown(false)

		dropdown.style.top = !showDropdown ? "58px" : "-1000px"
	}

	const handleSignOut = async e => {
		e.preventDefault()

		signOut()

		await axios({
			method: "post",
			url: `${ip}/users/sign-out`,
			headers: {
				authorization: token,
			},
		})
			.then(res => {
				console.log(res)

				history("/")
				window.location.reload()
			})
			.catch(e => console.log(e?.response?.data?.error || e.message))
	}

	return (
		<>
			<div className="header">
				<div>
					<Link to="/" className="header_branding">
						YorkNews
					</Link>

					<Link to="/reddit" className="header_menuBtn header_reddit">
						<FcReddit />
					</Link>
				</div>

				<button className="header_menuBtn" onClick={handleClick}>
					<AiOutlineMenu />
				</button>
			</div>
			<div className="dropdown" onMouseLeave={handleBlur}>
				{token ? (
					<>
						<Link className="dropdown_link" to="/profile">
							Profile
						</Link>
						{user.type === "author" && (
							<Link className="dropdown_link" to="/create">
								Create News
							</Link>
						)}
						<Switch
							theme={theme}
							toggleTheme={toggleTheme}
							switchState={switchState}
							setSwitchState={setSwitchState}
						/>
						<div className="dropdown_separator" />
						<button
							className="button button_primary dropdown_button"
							onClick={handleSignOut}
						>
							Sign Out
						</button>
					</>
				) : (
					<>
						<Link className="dropdown_link" to="/become-editor">
							Become an editor?
						</Link>
						<Switch
							theme={theme}
							toggleTheme={toggleTheme}
							switchState={switchState}
							setSwitchState={setSwitchState}
						/>
						<div className="dropdown_separator" />
						<Link
							className="button button_primary dropdown_button"
							to="/sign-up"
						>
							Sign Up
						</Link>
					</>
				)}
			</div>
		</>
	)
}

export default Header
