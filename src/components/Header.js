import React, { useContext, useEffect, useState } from "react"
import { AiOutlineMenu, AiOutlineSearch } from "react-icons/ai"
import { Link, useNavigate } from "react-router-dom"

import axios from "axios"

import "./Header.scss"
import { Switch } from "../components"
import { ThemeContext, UserContext } from "../context"

const ip = process.env.REACT_APP_EXPRESS_API_IP

function Header() {
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

	const handleClick = e => {
		e.preventDefault()

		const dropdown = document.querySelector(".dropdown")

		setShowDropdown(!showDropdown)

		dropdown.style.top = !showDropdown ? "53px" : "-1000px"
	}

	const handleBlur = e => {
		const dropdown = document.querySelector(".dropdown")

		setShowDropdown(false)

		dropdown.style.top = !showDropdown ? "53px" : "-1000px"
	}

	const handleSignOut = async e => {
		try {
			e.preventDefault()

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

	const handleSearch = async e => {
		e.preventDefault()

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
					<Link to="/" className="header_branding">
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
