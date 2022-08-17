import React, { useContext, useState } from "react"
import { AiOutlineMenu } from "react-icons/ai"
import { Link } from "react-router-dom"

import "./Header.scss"
import { HeaderMenu, HeaderSearch, ProfileHeader } from "../components"
import { UserContext } from "../context"

function Header({ userData, profileHeader }) {
	const { token } = useContext(UserContext)
	const [showDropdown, setShowDropdown] = useState(false)

	const toggleMenu = () => {
		const menu = document.querySelector(".dropdown")

		menu.style.left = !showDropdown ? "0" : "-500px"
		menu.previousSibling.style.display = !showDropdown ? "unset" : "none"

		setShowDropdown(value => !value)
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
						<HeaderSearch />
					</div>
				)}

				<div className="header_section3">
					<button className="header_menuBtn" onClick={toggleMenu}>
						<AiOutlineMenu />
					</button>
				</div>
			</div>
			{profileHeader && userData && <ProfileHeader user={userData} />}
			<HeaderMenu toggleMenu={toggleMenu} />
		</>
	)
}

export default Header
