import React, { useContext } from "react"
import { useNavigate } from "react-router"

import axios from "axios"

import "./HeaderMenu.scss"
import { AccordionMenu, HeaderSearch, Switch } from "."
import { UserContext } from "../context"
import { Link } from "react-router-dom"
import { AiOutlineRocket as Best } from "react-icons/ai"
import { MdOutlineNewReleases as New } from "react-icons/md"

const ip = process.env.REACT_APP_API_IP
const port = process.env.REACT_APP_EXPRESS_API_PORT

function HeaderMenu({ toggleMenu }) {
	const history = useNavigate()

	const { user, token, signOut } = useContext(UserContext)

	const feedSort = [
		{ id: "best", text: "Best", Icon: Best },
		{ id: "new", text: "New", Icon: New },
	]

	const profile = [
		{ id: "overview", text: "Overview" },
		{ id: "followed", text: "Following" },
		{ id: "liked", text: "Liked" },
		{ id: "saved", text: "Saved" },
	]

	if (user.type === "author") {
		profile.splice(2, 0, { id: "news", text: "News" })
	}

	const handleSignOut = async () => {
		try {
			signOut()

			await axios({
				method: "delete",
				url: `${ip}:${port}/users/sign-out`,
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

	return (
		<div>
			<div className="dropdown_overlay" onClick={toggleMenu} />
			<div className="dropdown">
				<div className="dropdown_section">
					{token ? (
						<>
							<HeaderSearch />
							<AccordionMenu title="Home Feed" baseUrl="" items={feedSort} />
							<AccordionMenu
								title="Followed Feed"
								baseUrl="/followed"
								items={feedSort}
							/>
							<Link className="dropdown_button" to="/r/romania">
								r/Romania
							</Link>
							<AccordionMenu
								title="Profile"
								baseUrl={`/profile/${user.id}`}
								items={profile}
							/>
							{user.type === "author" && (
								<Link className="dropdown_button" to="/news/create">
									Create News
								</Link>
							)}
						</>
					) : (
						<>
							<Link className="dropdown_button" to="/become-editor">
								Become an editor?
							</Link>
						</>
					)}
					<Switch />
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
		</div>
	)
}

export default HeaderMenu
