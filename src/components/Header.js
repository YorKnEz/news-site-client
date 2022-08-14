import React, { useContext, useEffect, useState } from "react"
import { AiOutlineMenu, AiOutlineSearch } from "react-icons/ai"
import { Link, useNavigate } from "react-router-dom"

import axios from "axios"

import "./Header.scss"
import { ProfileHeader, Switch } from "../components"
import { ThemeContext, UserContext } from "../context"

const ip = process.env.REACT_APP_EXPRESS_API_IP

function Header({ userData, profileHeader }) {
	const params = new Proxy(new URLSearchParams(window.location.search), {
		get: (searchParams, prop) => searchParams.get(prop),
	})
	const { user, token, signOut } = useContext(UserContext)
	const { theme, toggleTheme } = useContext(ThemeContext)
	const [showDropdown, setShowDropdown] = useState(false)
	const [switchState, setSwitchState] = useState(
		theme === "dark" ? true : false
	)
	const [search, setSearch] = useState(params.search ? params.search : "")
	const [filter, setFilter] = useState(params.filter ? params.filter : "title")
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

	const handleClick = () => {
		const dropdown = document.querySelector(".dropdown")

		setShowDropdown(!showDropdown)

		dropdown.style.top = !showDropdown
			? profileHeader && userData
				? "calc(55px + 40px)"
				: "55px"
			: "-1000px"
	}

	const handleBlur = () => {
		const dropdown = document.querySelector(".dropdown")

		setShowDropdown(false)

		dropdown.style.top = !showDropdown
			? profileHeader && userData
				? "calc(55px + 40px)"
				: "55px"
			: "-1000px"
	}

	const handleSignOut = async () => {
		try {
			signOut()

			await axios({
				method: "delete",
				url: `${ip}/users/sign-out`,
				headers: {
					authorization: token,
				},
			})

			history("/")
			window.location.reload()
		} catch (error) {
			console.error(error?.response?.data?.message || error.message)
		}
	}

	const handleSearch = async () => {
		history(`/search?search=${search}&filter=${filter}`, { replace: false })
		window.location.reload()
	}

	const handleSubmit = async e => {
		if (e.code === "Enter") {
			handleSearch(e)
		}
	}

	return (
		<>
			<div className="header">
				<div className="header_section1">
					<Link to="/" reloadDocument className="header_branding">
						YorkNews
					</Link>
				</div>

				{token && (
					<div className="header_section2">
						<div className="header_search">
							<input
								id="search-input"
								className="header_search_input"
								placeholder="Search..."
								type="text"
								onChange={e => setSearch(e.target.value)}
								onKeyDown={handleSubmit}
								value={search}
								title="Separate tags by ', ' and the rest by ' '"
							/>
							<select
								className="header_search_category"
								onChange={e => setFilter(e.target.value)}
								value={filter}
							>
								<option value="title">Title</option>
								<option value="body">Body</option>
								<option value="tags">Tags</option>
								<option value="author">Author</option>
							</select>
						</div>
						<button onClick={handleSearch} className="header_search_button">
							<AiOutlineSearch className="header_search_button_icon" />
						</button>
					</div>
				)}

				<div className="header_section3">
					<button className="header_menuBtn" onClick={handleClick}>
						<AiOutlineMenu />
					</button>
				</div>
			</div>
			{profileHeader && userData && <ProfileHeader user={userData} />}
			<div className="dropdown" onMouseLeave={handleBlur}>
				<div className="dropdown_section">
					{token ? (
						<>
							<Link
								className="dropdown_button"
								to={`/profile/${user.id}/overview`}
							>
								Profile
							</Link>
							{user.type === "author" && (
								<Link className="dropdown_button" to="/news/create">
									Create News
								</Link>
							)}
							<Switch
								theme={theme}
								toggleTheme={toggleTheme}
								switchState={switchState}
								setSwitchState={setSwitchState}
							/>
						</>
					) : (
						<>
							<Link className="dropdown_button" to="/become-editor">
								Become an editor?
							</Link>
							<Switch
								theme={theme}
								toggleTheme={toggleTheme}
								switchState={switchState}
								setSwitchState={setSwitchState}
							/>
						</>
					)}
				</div>
				<div className="dropdown_section">
					{token ? (
						<button
							className="dropdown_button dropdown_button_centered"
							onClick={handleSignOut}
						>
							Sign Out
						</button>
					) : (
						<Link
							className="dropdown_button dropdown_button_centered"
							to="/sign-up"
						>
							Sign Up
						</Link>
					)}
				</div>
			</div>
		</>
	)
}

export default Header
