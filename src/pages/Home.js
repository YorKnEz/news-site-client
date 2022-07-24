import React, { useEffect, useState } from "react"

import { useQuery } from "@apollo/client"

import "./Home.scss"
import { NewsCard, Page, QueryResult } from "../components"
import { NEWS_FOR_HOME } from "../utils/apollo-queries"
import { useDocumentTitle } from "../utils/utils"

function Home() {
	const [reachedBottomOfPage, setReachedBottomOfPage] = useState(0)
	const [offsetIndex, setOffsetIndex] = useState(0)
	const [news, setNews] = useState([])
	const { loading, error, data } = useQuery(NEWS_FOR_HOME, {
		variables: {
			offsetIndex,
		},
	})
	// eslint-disable-next-line no-unused-vars
	const [documentTitle, setDocumentTitle] = useDocumentTitle("Home | YorkNews")

	useEffect(() => {
		if (data) {
			setNews(news => [...news, ...data.newsForHome])
		}
	}, [data])

	useEffect(() => {
		if (reachedBottomOfPage) {
			setReachedBottomOfPage(false)
			setOffsetIndex(offsetIndex + 1)
		}
	}, [reachedBottomOfPage, offsetIndex])

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
			<div className="news_list">
				{news.map(item => (
					<NewsCard data={item} key={item.id} />
				))}
			</div>
			<QueryResult loading={loading} error={error} data={data} />
		</Page>
	)
}

export default Home
