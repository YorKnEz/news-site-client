import React, { useEffect, useState } from "react"

import { useQuery } from "@apollo/client"

import "./index.scss"
import { QueryResult, RedditNewsCard } from "../../components"
import { NEWS_FOR_HOME_REDDIT } from "../../utils/apollo-queries"

function RedditNews() {
	const [reachedBottomOfPage, setReachedBottomOfPage] = useState(0)
	const [after, setAfter] = useState("")
	const [news, setNews] = useState([])
	const { loading, error, data } = useQuery(NEWS_FOR_HOME_REDDIT, {
		variables: {
			after,
		},
	})

	useEffect(() => {
		if (data) setNews(news => [...news, ...data.newsForHomeReddit.news])
	}, [data])

	useEffect(() => {
		if (reachedBottomOfPage) {
			setReachedBottomOfPage(false)
			if (data) setAfter(data.newsForHomeReddit.after)
		}
	}, [reachedBottomOfPage, after, data])

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
				<RedditNewsCard data={item} key={item.id} />
			))}
			<QueryResult loading={loading} error={error} data={data} />
		</div>
	)
}

export default RedditNews
