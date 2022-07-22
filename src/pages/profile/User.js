import React, { useContext, useEffect, useState } from "react"

import "./index.scss"
import { Page } from "../../components"
import { UserContext } from "../../context"
import { UserFollowedAuthors, UserLikedNews } from "../profile"
import { useDocumentTitle } from "../../utils/utils"

function User() {
	const { user } = useContext(UserContext)
	const [page, setPage] = useState("followedAuthors")
	// eslint-disable-next-line no-unused-vars
	const [documentTitle, setDocumentTitle] =
		useDocumentTitle("Profile | YorkNews")

	// highlight the current page
	useEffect(() => {
		const button1 = document.getElementById("followedAuthors")

		button1.classList.add("profile_pages_button_active")

		return () => {
			button1.classList.remove("profile_pages_button_active")
		}
	}, [])

	const handlePage = (e, name) => {
		e.preventDefault()

		const button1 = document.getElementById("followedAuthors")
		const button2 = document.getElementById("likedNews")

		if (name === "followedAuthors") {
			button1.classList.add("profile_pages_button_active")
			button2.classList.remove("profile_pages_button_active")
		} else {
			button1.classList.remove("profile_pages_button_active")
			button2.classList.add("profile_pages_button_active")
		}

		setPage(name)
	}

	return (
		<Page>
			<div className="profile">
				<div className="profile_info">
					{user.profilePicture === "default" ? (
						<img src="/default_avatar.png" alt="avatar of user" />
					) : (
						<img src={user.profilePicture} alt="avatar of user" />
					)}
					<div className="profile_info_text">
						<div className="profile_info_text2">
							<h3>{user.fullName}</h3>
							<h4>{user.type}</h4>
						</div>
						<p>{user.email}</p>
					</div>
				</div>
				<div className="profile_pages">
					<button
						onClick={e => handlePage(e, "followedAuthors")}
						id="followedAuthors"
						className="button profile_pages_button"
					>
						<h3 className="profile_pages_title">Followed authors</h3>
					</button>
					<button
						onClick={e => handlePage(e, "likedNews")}
						id="likedNews"
						className="button profile_pages_button"
					>
						<h3 className="profile_pages_title">Liked news</h3>
					</button>
				</div>
				{page === "followedAuthors" ? (
					<UserFollowedAuthors />
				) : (
					<UserLikedNews />
				)}
			</div>
		</Page>
	)
}

export default User
