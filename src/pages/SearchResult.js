import React from "react"
import { useQuery, gql } from "@apollo/client"
import { AuthorCard, NewsCard, Page, QueryResult } from "../components"

import "./SearchResult.scss"

const QUERY = gql`
	query Query($search: String!, $filter: String!) {
		search(search: $search, filter: $filter) {
			matches
			news {
				id
				title
				subreddit
				thumbnail
				sources
				tags
				body
				type
				createdAt
				updatedAt
				author {
					id
					fullName
					profilePicture
				}
			}
			author {
				id
				fullName
				email
				profilePicture
				writtenNews
				followers
				createdAt
				following
			}
		}
	}
`

function SearchResult() {
	const params = new Proxy(new URLSearchParams(window.location.search), {
		get: (searchParams, prop) => searchParams.get(prop),
	})
	const { loading, error, data } = useQuery(QUERY, {
		variables: {
			search: params.search,
			filter: params.filter,
		},
	})

	const dataToDisplay = () => {
		if (data) {
			if (data.search.length < 1) {
				return (
					<div>
						No {params.filter === "author" ? "authors" : "news"} found matching
						your query.
					</div>
				)
			}

			if (params.filter === "author") {
				return data.search.map(obj => (
					<AuthorCard data={obj.author} key={obj.author.id} />
				))
			}

			return data.search.map(obj => (
				<NewsCard data={obj.news} key={obj.news.id} matches={obj?.matches} />
			))
		}

		return <></>
	}

	return (
		<Page>
			<div className="searchResult">
				{data && console.log(data)}
				{dataToDisplay()}
				<QueryResult loading={loading} error={error} data={data} />
			</div>
		</Page>
	)
}

export default SearchResult
