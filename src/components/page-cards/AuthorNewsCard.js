import React, { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"

import { useQuery } from "@apollo/client"

import "./AuthorNewsCard.scss"
import { BaseCard } from "."
import { QueryResult } from "../../components"
import { NEWS_FOR_PROFILE_CARD } from "../../utils/apollo-queries"
import { compressNumber } from "../../utils/utils"

const HOW_MANY_BEST = 2
const HOW_MANY_RECENT = 1

function NewsItem({ newsData }) {
	if (newsData)
		return (
			<Link
				to={`/news/${newsData.id}`}
				key={newsData.id}
				className="authornewscard_container"
			>
				<span className="authornewscard_container_title">{newsData.title}</span>
				<span className="authornewscard_container_score">
					{compressNumber(newsData.score)}
				</span>
			</Link>
		)

	return ""
}

function AuthorNewsCard() {
	const { id, newsId } = useParams()
	const [best, setBest] = useState([])
	const [mostRecent, setMostRecent] = useState([])

	const { loading, error, data } = useQuery(NEWS_FOR_PROFILE_CARD, {
		variables: {
			id,
			newsId,
			howManyBest: HOW_MANY_BEST,
			howManyRecent: HOW_MANY_RECENT,
		},
	})

	useEffect(() => {
		if (data) {
			setBest(data.newsForProfileCard.best)
			setMostRecent(data.newsForProfileCard.recent)
		}
	}, [data])

	return (
		<BaseCard thumbnailIndex={1} title="More from this author" list>
			<QueryResult loading={loading} error={error} data={data}>
				<span className="authornewscard_title">TOP NEWS</span>
				{best.map(news => (
					<NewsItem key={news.id} newsData={news} />
				))}
				<span className="authornewscard_title">MOST RECENT NEWS</span>
				{mostRecent.map(news => (
					<NewsItem key={news.id} newsData={news} />
				))}
			</QueryResult>
		</BaseCard>
	)
}

export default AuthorNewsCard
