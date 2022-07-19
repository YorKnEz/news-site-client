import React, { useContext, useEffect, useState } from "react"

import { useQuery } from "@apollo/client"

import "./index.scss"
import { AuthorCard, Page } from "../../components"
import { UserContext } from "../../context"
import { FOLLOWED_AUTHORS } from "../../utils/apollo-queries"
import { useDocumentTitle } from "../../utils/utils"

function User() {
	const { user } = useContext(UserContext)
	const [reachedBottomOfPage, setReachedBottomOfPage] = useState(0)
	const [offsetIndex, setOffsetIndex] = useState(0)
	const [authors, setAuthors] = useState([])
	const { loading, error, data } = useQuery(FOLLOWED_AUTHORS, {
		variables: { offsetIndex },
	})
	// eslint-disable-next-line no-unused-vars
	const [documentTitle, setDocumentTitle] =
		useDocumentTitle("Profile | YorkNews")

	useEffect(() => {
		if (data) {
			console.log(data)

			setAuthors(authors => [...authors, ...data.followedAuthors])
		}
	}, [data])

	useEffect(() => {
		if (reachedBottomOfPage) {
			setReachedBottomOfPage(false)
			setOffsetIndex(offsetIndex + 1)
		}
	}, [reachedBottomOfPage, offsetIndex])

	// check if the user scrolled to the bottom of the page so we can request more news only then
	window.addEventListener("scroll", event => {
		const { clientHeight, scrollHeight, scrollTop } =
			event.target.scrollingElement

		if (!loading && !error && scrollHeight - clientHeight === scrollTop) {
			setReachedBottomOfPage(true)
		}
	})

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
				<hr style={{ width: "100%" }} />
				<h3>Followed authors:</h3>
				<div className="profile_followedAuthors">
					{authors.map(author => (
						<AuthorCard key={author.id} data={author} infoBelow />
					))}
				</div>
			</div>
		</Page>
	)
}

export default User
