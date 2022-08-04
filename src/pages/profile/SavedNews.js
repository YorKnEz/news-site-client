import React, { useEffect, useState } from "react"

import { useQuery } from "@apollo/client"

import { NewsCard, QueryResult } from "../../components"
import { SAVED_NEWS } from "../../utils/apollo-queries"

function SavedNews() {
	const [reachedBottomOfPage, setReachedBottomOfPage] = useState(0)
	const [savedNews, setSavedNews] = useState([])
	const [oldestId, setOldestId] = useState("")

	const { loading, error, data } = useQuery(SAVED_NEWS, {
		variables: { oldestId },
	})

	useEffect(() => {
		if (data) {
			console.log(data)

			setSavedNews(news => [...news, ...data.savedNews])
		}
	}, [data])

	useEffect(() => {
		if (reachedBottomOfPage) {
			setReachedBottomOfPage(false)
			if (savedNews.length > 0) setOldestId(savedNews[savedNews.length - 1].id)
		}
	}, [reachedBottomOfPage, savedNews])

	// check if the user scrolled to the bottom of the page so we can request more news only then
	window.addEventListener("scroll", event => {
		const { clientHeight, scrollHeight, scrollTop } =
			event.target.scrollingElement

		if (!loading && !error && scrollHeight - clientHeight === scrollTop) {
			setReachedBottomOfPage(true)
		}
	})

	return (
		<div className="profile_news">
			{savedNews.map(news => (
				<NewsCard key={news.id} data={news} />
			))}
			<QueryResult loading={loading} error={error} data={data} />
		</div>
	)
}

export default SavedNews
