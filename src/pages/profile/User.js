import React, { useContext, useEffect, useState } from "react"

import "./index.scss"
import { Page } from "../../components"
import { UserContext } from "../../context"
import { FollowedAuthors, LikedNews } from "../profile"
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

		button1.classList.add("profile_pages_item_active")

		return () => {
			button1.classList.remove("profile_pages_item_active")
		}
	}, [])

	const handlePage = (e, name) => {
		e.preventDefault()

		// find the old active button
		const oldActiveButton = document.getElementById(page)
		// remove the active class
		oldActiveButton.classList.remove("profile_pages_item_active")

		// find the new active button
		const activeButton = document.getElementById(name)
		// add the active class
		activeButton.classList.add("profile_pages_item_active")

		setPage(name)
	}

	return (
		<Page>
			<div className="profile">
				<div className="profile_container">
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
				</div>
				<div className="profile_pages">
					<button
						onClick={e => handlePage(e, "followedAuthors")}
						id="followedAuthors"
						className="button profile_pages_item profile_pages_item_active"
					>
						<h3 className="profile_pages_title">Followed authors</h3>
					</button>
					<button
						onClick={e => handlePage(e, "likedNews")}
						id="likedNews"
						className="button profile_pages_item"
					>
						<h3 className="profile_pages_title">Liked news</h3>
					</button>
				</div>
				{page === "followedAuthors" ? <FollowedAuthors /> : <LikedNews />}
			</div>
		</Page>
	)
}

export default User
