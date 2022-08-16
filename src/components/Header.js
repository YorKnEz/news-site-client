import React, { useContext, useState } from "react"
import { AiOutlineMenu } from "react-icons/ai"
import { Link } from "react-router-dom"

import "./Header.scss"
import { HeaderDropdown, HeaderSearch, ProfileHeader } from "../components"
import { UserContext } from "../context"

function Header({ userData, profileHeader }) {
	const { token } = useContext(UserContext)
	const [showDropdown, setShowDropdown] = useState(false)

	const toggleMenu = async e => {
		const dropdown = document.querySelector(".dropdown")

		setShowDropdown(value => !value)

		dropdown.style.top = !showDropdown
			? profileHeader && userData
				? "calc(54px + 40px)"
				: "54px"
			: "-1000px"
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
			<HeaderDropdown
				showDropdown={showDropdown}
				setShowDropdown={setShowDropdown}
				userData={userData}
				profileHeader={profileHeader}
			/>
		</>
	)
}

export default Header
