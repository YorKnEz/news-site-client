import React from "react"
import { AiOutlineFrown } from "react-icons/ai"

import { useQuery } from "@apollo/client"

import "./SearchResult.scss"
import { AuthorCard, NewsCard, Page, QueryResult } from "../components"
import { SEARCH } from "../utils/apollo-queries"

function SearchResult() {
	const params = new Proxy(new URLSearchParams(window.location.search), {
		get: (searchParams, prop) => searchParams.get(prop),
	})
	const { loading, error, data } = useQuery(SEARCH, {
		variables: {
			search: params.search,
			filter: params.filter,
		},
	})

	const dataToDisplay = () => {
		if (data) {
			if (data.search.length === 0) {
				return (
					<div
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							margin: "40px 0",
							fontSize: "20px",
						}}
					>
						<AiOutlineFrown />
						<p style={{ marginLeft: "16px" }}>
							No {params.filter === "author" ? "authors" : "news"} found
							matching your query.
						</p>
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
