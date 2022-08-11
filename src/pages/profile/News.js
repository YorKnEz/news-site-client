import React, { useEffect, useState } from "react"
import { useParams } from "react-router"

import { useQuery } from "@apollo/client"

import { NEWS_FOR_PROFILE } from "../../utils/apollo-queries"
import { NewsCard, PageWithCards, QueryResult } from "../../components"

function News() {
	const { id } = useParams()

	const [reachedBottomOfPage, setReachedBottomOfPage] = useState(0)
	const [news, setNews] = useState([])
	const [oldestId, setOldestId] = useState("")

	const { loading, error, data } = useQuery(NEWS_FOR_PROFILE, {
		variables: {
			oldestId,
			id,
		},
	})

	// update the state after each apollo request
	useEffect(() => {
		if (data) {
			console.log(data)

			setNews(news => [...news, ...data.newsForProfile])
		}
	}, [data])

	// check if user has reached bottom of the page
	useEffect(() => {
		if (reachedBottomOfPage) {
			setReachedBottomOfPage(false)
			if (news.length > 0) setOldestId(news[news.length - 1].id)
		}
	}, [reachedBottomOfPage, news])

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
				{news.map(item => (
					<NewsCard data={item} key={item.id} />
				))}
				<QueryResult loading={loading} error={error} data={data} />
			</div>
		</PageWithCards>
	)
}

export default News
