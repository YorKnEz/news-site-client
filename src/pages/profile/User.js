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

	const pages = [
		{ id: "followedAuthors", text: "Followed", component: <FollowedAuthors /> },
		{ id: "likedNews", text: "Liked", component: <LikedNews /> },
	]

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
				<div
					className="profile_pages"
					style={{
						gridTemplateColumns: `repeat(${pages.length}, calc(100% / ${pages.length}))`,
					}}
				>
					{pages.map(page => (
						<button
							onClick={e => handlePage(e, page.id)}
							key={page.id}
							id={page.id}
							className="button profile_pages_item"
						>
							<h3 className="profile_pages_title">{page.text}</h3>
						</button>
					))}
				</div>
				{pages.find(item => item.id === page).component}
			</div>
		</Page>
	)
}

export default User
