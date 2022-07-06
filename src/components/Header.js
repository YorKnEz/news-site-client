import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AiOutlineMenu } from "react-icons/ai"
import { FcReddit } from "react-icons/fc"

import "./Header.scss"
import { ThemeContext, UserContext } from "../context"
import Switch from "./Switch"

function Header({ theme, signOut }) {
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
		e.preventDefault()

		const dropdown = document.querySelector(".dropdown")

		setShowDropdown(false)

		dropdown.style.top = !showDropdown ? "58px" : "-1000px"
	}

	const handleSignOut = e => {
		signOut()

		history("/")
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
			<UserContext.Consumer>
				{({ token, user }) => (
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
								<ThemeContext.Consumer>
									{({ toggleTheme }) => (
										<Switch
											theme={theme}
											toggleTheme={toggleTheme}
											switchState={switchState}
											setSwitchState={setSwitchState}
										/>
									)}
								</ThemeContext.Consumer>
								<div className="dropdown_separator" />
								<button className="dropdown_button" onClick={handleSignOut}>
									Sign Out
								</button>
							</>
						) : (
							<>
								<Link className="dropdown_link" to="/become-editor">
									Become an editor?
								</Link>
								<ThemeContext.Consumer>
									{({ toggleTheme }) => (
										<Switch
											theme={theme}
											toggleTheme={toggleTheme}
											switchState={switchState}
											setSwitchState={setSwitchState}
										/>
									)}
								</ThemeContext.Consumer>
								<div className="dropdown_separator" />
								<Link className="dropdown_button" to="/sign-up">
									Sign Up
								</Link>
							</>
						)}
					</div>
				)}
			</UserContext.Consumer>
		</>
	)
}

export default Header
