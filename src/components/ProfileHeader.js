import React from "react"
import { Link } from "react-router-dom"

import "./ProfileHeader.scss"

function ProfileHeader({ user }) {
	const pages = ["overview", "followed", "liked", "saved"]

	if (user.type === "author") pages.splice(1, 0, "news")

	pages.forEach(page => {
		if (window.location.pathname.includes(page)) {
			const button = document.getElementById(page)

			if (button) button.classList.add("profileheader_button_active")
		}
	})

	return (
		<div className="profileheader">
			<div className="profileheader_container">
				{pages.map(page => (
					<Link
						id={page}
						key={page}
						className="profileheader_button"
						to={`/profile/${user.id}/${page}`}
					>
						{page.toUpperCase()}
					</Link>
				))}
			</div>
		</div>
	)
}

export default ProfileHeader
