import React, { useEffect, useState } from "react"
import { AiOutlineFrown } from "react-icons/ai"

import { useQuery } from "@apollo/client"

import "./SearchResult.scss"
import { NewsCard, Page, QueryResult, RedditNewsCard } from "../components"
import { AuthorProfileCard } from "../components/page-cards"
import { SEARCH } from "../utils/apollo-queries"
import { useReachedBottom } from "../utils/utils"

function SearchResult() {
	const params = new Proxy(new URLSearchParams(window.location.search), {
		get: (searchParams, prop) => searchParams.get(prop),
	})

	const [results, setResults] = useState([])
	const [fetchedResults, setFetchedResults] = useState(0)

	const { loading, error, data } = useQuery(SEARCH, {
		variables: {
			search: params.search,
			filter: params.filter,
			fetchedResults,
		},
	})

	const [reachedBottom, setReachedBottom] = useReachedBottom(loading, error)

	useEffect(() => {
		if (data) {
			setResults(items => [...items, ...data.search])
		}
	}, [data])

	useEffect(() => {
		if (reachedBottom) {
			setReachedBottom(false)
			setFetchedResults(results.length)
		}
	}, [reachedBottom, setReachedBottom, results])

	return (
		<Page>
			<div
				className={`searchResult${
					params.filter === "author" ? "_authors" : ""
				}`}
			>
				{results.map(({ result }) => {
					const { __typename, id, type, matches } = result
					if (__typename === "Author") {
						return <AuthorProfileCard data={result} key={id} />
					}

					if (__typename === "News") {
						if (type === "created") {
							return <NewsCard data={result} key={id} matches={matches} />
						}

						if (result.type === "reddit") {
							return <RedditNewsCard data={result} key={id} matches={matches} />
						}
					}

					return null
				})}
				{data?.search.length === 0 && (
					<div className="searchResult_404">
						<AiOutlineFrown />
						<p className="searchResult_404_paragraph">
							No {params.filter === "author" ? "authors" : "news"} found
							matching your query.
						</p>
					</div>
				)}
				<QueryResult loading={loading} error={error} data={data} />
			</div>
		</Page>
	)
}

export default SearchResult
