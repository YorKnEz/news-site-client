import React, { useEffect, useState } from "react"

import { useQuery } from "@apollo/client"

import { FOLLOWED_AUTHORS } from "../../utils/apollo-queries"
import { AuthorCard } from "../../components"

function FollowedAuthors() {
	const [reachedBottomOfPage, setReachedBottomOfPage] = useState(0)
	const [offset, setOffset] = useState(0)
	const [authors, setAuthors] = useState([])

	const { loading, error, data } = useQuery(FOLLOWED_AUTHORS, {
		variables: { offset },
	})

	useEffect(() => {
		if (data) {
			console.log(data)

			setAuthors(authors => [...authors, ...data.followedAuthors])
		}
	}, [data])

	useEffect(() => {
		if (reachedBottomOfPage) {
			setReachedBottomOfPage(false)
			setOffset(authors.length)
		}
	}, [reachedBottomOfPage, authors.length])

	// check if the user scrolled to the bottom of the page so we can request more news only then
	window.addEventListener("scroll", event => {
		const { clientHeight, scrollHeight, scrollTop } =
			event.target.scrollingElement

		if (!loading && !error && scrollHeight - clientHeight === scrollTop) {
			setReachedBottomOfPage(true)
		}
	})

	return (
		<div className="profile_followedAuthors">
			{authors.map(author => (
				<AuthorCard key={author.id} data={author} infoBelow />
			))}
		</div>
	)
}

export default FollowedAuthors
