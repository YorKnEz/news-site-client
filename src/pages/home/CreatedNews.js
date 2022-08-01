import React, { useEffect, useState } from "react"

import { useQuery } from "@apollo/client"

import "./index.scss"
import { NewsCard, QueryResult } from "../../components"
import { NEWS_FOR_HOME } from "../../utils/apollo-queries"

function CreatedNews() {
	const [reachedBottomOfPage, setReachedBottomOfPage] = useState(0)
	const [offset, setOffset] = useState(0)
	const [news, setNews] = useState([])
	const { loading, error, data } = useQuery(NEWS_FOR_HOME, {
		variables: {
			offset,
		},
	})

	useEffect(() => {
		if (data) {
			setNews(news => [...news, ...data.newsForHome])
		}
	}, [data])

	useEffect(() => {
		if (reachedBottomOfPage) {
			setReachedBottomOfPage(false)
			setOffset(news.length)
		}
	}, [reachedBottomOfPage, news.length])

	// check if the user scrolled to the bottom of the page so we can request more news only then
	window.addEventListener("scroll", event => {
		const { clientHeight, scrollHeight, scrollTop } =
			event.target.scrollingElement

		if (!loading && !error && scrollHeight - clientHeight === scrollTop) {
			setReachedBottomOfPage(true)
		}
	})

	return (
		<div className="news_list">
			{news.map(item => (
				<NewsCard data={item} key={item.id} />
			))}
			<QueryResult loading={loading} error={error} data={data} />
		</div>
	)
}

export default CreatedNews
