import React, { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"

import { useQuery } from "@apollo/client"

import "./AuthorNewsCard.scss"
import { BaseCard } from "."
import { QueryResult } from "../../components"
import { NEWS_FOR_PROFILE_CARD } from "../../utils/apollo-queries"
import { compressNumber } from "../../utils/utils"

function AuthorNewsCard() {
	const { id, newsId } = useParams()
	const [news, setNews] = useState([])

	const { loading, error, data } = useQuery(NEWS_FOR_PROFILE_CARD, {
		variables: {
			id,
			newsId,
		},
	})

	useEffect(() => {
		if (data) {
			setNews(
				data.newsForProfileCard.map((n, index) => ({
					...n,
					id: `${index < 2 ? "best" : "recent"}-${n.id}`,
				}))
			)
		}
	}, [data])

	function NewsItem({ newsData }) {
		if (newsData)
			return (
				<Link
					to={`/news/${newsData.id}`}
					key={newsData.id}
					className="authornewscard_container"
				>
					<span className="authornewscard_container_title">
						{newsData.title}
					</span>
					<span className="authornewscard_container_score">
						{compressNumber(newsData.score)}
					</span>
				</Link>
			)

		return ""
	}

	return (
		<BaseCard thumbnailIndex={1} title="More from this author" list>
			<QueryResult loading={loading} error={error} data={data}>
				<span className="authornewscard_title">TOP NEWS</span>
				<NewsItem newsData={news[1]} />
				<NewsItem newsData={news[0]} />
				<span className="authornewscard_title">MOST RECENT NEWS</span>
				<NewsItem newsData={news[2]} />
			</QueryResult>
		</BaseCard>
	)
}

export default AuthorNewsCard
