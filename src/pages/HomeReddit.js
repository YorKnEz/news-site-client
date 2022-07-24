import React, { useEffect, useState } from "react"

import { useQuery } from "@apollo/client"

import "./Home.scss"
import { Page, QueryResult, RedditNewsCard } from "../components"
import { NEWS_FOR_REDDIT_HOME } from "../utils/apollo-queries"
import { useDocumentTitle } from "../utils/utils"

function HomeReddit() {
	const [reachedBottomOfPage, setReachedBottomOfPage] = useState(0)
	const [after, setAfter] = useState("")
	const [news, setNews] = useState([])
	const { loading, error, data } = useQuery(NEWS_FOR_REDDIT_HOME, {
		variables: {
			after,
		},
	})
	// eslint-disable-next-line no-unused-vars
	const [documentTitle, setDocumentTitle] = useDocumentTitle(
		"Reddit News | YorkNews"
	)

	useEffect(() => {
		if (data) {
			console.log(data)

			setNews(news => [...news, ...data.newsForRedditHome.news])
		}
	}, [data])

	useEffect(() => {
		if (reachedBottomOfPage) {
			setReachedBottomOfPage(false)
			if (data) setAfter(data.newsForRedditHome.after)
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
		<Page>
			<div className="news_listReddit">
				{news.map(item => (
					<RedditNewsCard data={item} key={item.id} />
				))}
			</div>
			<QueryResult loading={loading} error={error} data={data} />
		</Page>
	)
}

export default HomeReddit
