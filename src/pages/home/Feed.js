import React, { useEffect, useState } from "react"

import { useQuery } from "@apollo/client"

import "./index.scss"
import {
	HomeSort,
	NewsCard,
	PageWithCards,
	QueryResult,
} from "../../components"
import { NEWS_FOR_HOME } from "../../utils/apollo-queries"

function Feed({ sortBy }) {
	const [reachedBottomOfPage, setReachedBottomOfPage] = useState(0)
	const [news, setNews] = useState([])
	const [oldestId, setOldestId] = useState("")

	const { loading, error, data } = useQuery(NEWS_FOR_HOME, {
		variables: {
			oldestId,
			sortBy,
		},
	})

	useEffect(() => {
		setReachedBottomOfPage(0)
		setNews([])
		setOldestId("")
	}, [sortBy])

	useEffect(() => {
		if (data) setNews(news => [...news, ...data.newsForHome])
	}, [data])

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
			<HomeSort sortBy={sortBy} />
			{news.map(item => (
				<NewsCard data={item} key={item.id} />
			))}
			<QueryResult loading={loading} error={error} data={data} />
		</PageWithCards>
	)
}

export default Feed
