import React, { useContext } from "react"
import { useNavigate } from "react-router"

import axios from "axios"

import "./HeaderDropdown.scss"
import { HeaderSearch, Switch } from "../components"
import { UserContext } from "../context"
import { Link } from "react-router-dom"

const ip = process.env.REACT_APP_EXPRESS_API_IP

function HeaderDropdown({
	showDropdown,
	setShowDropdown,
	userData,
	profileHeader,
}) {
	const history = useNavigate()

	const { user, token, signOut } = useContext(UserContext)

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

	return (
		<div className="dropdown">
			<div className="dropdown_section">
				{token ? (
					<>
						<HeaderSearch />
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
	)
}

export default HeaderDropdown
