import React, { useEffect, useState } from "react"

import { useQuery } from "@apollo/client"

import { AuthorCard, PageWithCards, QueryResult } from "../../components"
import { FOLLOWED_AUTHORS } from "../../utils/apollo-queries"

function FollowedAuthors() {
	const [reachedBottomOfPage, setReachedBottomOfPage] = useState(0)
	const [offset, setOffset] = useState(0)
	const [authors, setAuthors] = useState([])

	const { loading, error, data } = useQuery(FOLLOWED_AUTHORS, {
		variables: { offset },
	})

	useEffect(() => {
		if (data) setAuthors(authors => [...authors, ...data.followedAuthors])
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
		<PageWithCards>
			<div className="profile_news">
				{authors.map(author => (
					<AuthorCard key={author.id} data={author} />
				))}
				<QueryResult loading={loading} error={error} data={data} />
			</div>
		</PageWithCards>
	)
}

export default FollowedAuthors
