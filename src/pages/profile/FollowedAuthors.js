import React, { useEffect, useState } from "react"
import { useParams } from "react-router"

import { useQuery } from "@apollo/client"

import { PageWithCards, QueryResult } from "../../components"
import { AuthorProfileCard } from "../../components/page-cards"
import { FOLLOWED_AUTHORS } from "../../utils/apollo-queries"
import { useReachedBottom } from "../../utils/utils"

function FollowedAuthors() {
    const { id } = useParams()
    console.log(id)
	const [offset, setOffset] = useState(0)
	const [authors, setAuthors] = useState([])

	const { loading, error, data } = useQuery(FOLLOWED_AUTHORS, {
        variables: { offset, userId: id },
	})
	const [reachedBottom, setReachedBottom] = useReachedBottom(loading, error)

	useEffect(() => {
		if (data) setAuthors(authors => [...authors, ...data.followedAuthors])
	}, [data])

	useEffect(() => {
		if (reachedBottom) {
			setReachedBottom(false)
			setOffset(authors.length)
		}
	}, [reachedBottom, setReachedBottom, authors.length])

	return (
		<PageWithCards>
			<div className="profile_followedAuthors">
				{authors.map(author => (
					<AuthorProfileCard key={author.id} data={author} />
				))}
				<QueryResult loading={loading} error={error} data={data} />
			</div>
		</PageWithCards>
	)
}

export default FollowedAuthors
